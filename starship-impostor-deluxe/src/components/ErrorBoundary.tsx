import React from "react";
import { logGameError } from "../game/errorLogger";

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || "不明な描画エラーが発生しました" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logGameError("ReactErrorBoundary", error, "ERROR", info.componentStack || undefined);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="sf-panel max-w-lg w-full rounded-3xl p-6 border-rose-500/70 space-y-4 text-center">
            <div className="text-4xl">🚨</div>
            <h2 className="text-xl font-black text-rose-400">
              予期せぬエラーが発生しました
            </h2>
            <p className="text-xs text-slate-300 bg-slate-900/90 border border-slate-800 rounded-xl p-3 break-words font-mono">
              {this.state.message}
            </p>
            <p className="text-[11px] text-slate-400">
              エラー内容は「設定 → エラーログ」タブに自動記録されました。
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="sf-btn px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs"
            >
              🔄 画面を再復旧する
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

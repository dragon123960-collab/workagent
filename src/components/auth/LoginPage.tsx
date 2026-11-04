import React, { useState } from 'react';
import { Bot, ArrowRight, ShieldCheck, Lock, CheckCircle2, QrCode } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginMode, setLoginMode] = useState<'feishu' | 'account'>('feishu');
  const [email, setEmail] = useState('dongping@company.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleFeishuLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  const handleAccountLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-between p-6 select-none relative overflow-hidden">
      {/* Subtle clean enterprise ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight">Lucas</span>
            <span className="text-[10px] text-blue-700 font-semibold ml-2 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
              企业级 Agent 平台
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            企业数据沙箱隔离
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            飞书企业应用鉴权
          </span>
        </div>
      </div>

      {/* Center Focused Login Card */}
      <div className="w-full max-w-md mx-auto my-auto relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10 space-y-6">
          {/* Brand & Kicker */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs ring-4 ring-blue-50 mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              你的工作，多一位助理。
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              使用公司飞书账号登录，连接资料、项目与日常工作。
            </p>
          </div>

          {/* Login Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setLoginMode('feishu')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                loginMode === 'feishu'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              飞书企业 SSO 登录
            </button>
            <button
              onClick={() => setLoginMode('account')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                loginMode === 'account'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              内部凭证登录
            </button>
          </div>

          {loginMode === 'feishu' ? (
            /* Feishu SSO Mode */
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  已检测到当前企业租户
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  成都智行创新科技有限公司 · 企业内网免密通道就绪
                </p>
              </div>

              <button
                type="button"
                onClick={handleFeishuLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#3370FF] hover:bg-[#2860E1] active:bg-[#1F55C9] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>正在调起飞书安全令牌...</span>
                ) : (
                  <>
                    <span>使用飞书账号快速登录</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>亦支持飞书移动端扫码授权</span>
              </div>
            </div>
          ) : (
            /* Account Login Mode */
            <form onSubmit={handleAccountLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">企业邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">账号密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                {isLoading ? '验证中...' : '登录企业工作台'}
              </button>
            </form>
          )}

          {/* Security reassurance footer */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              数据传输采用 TLS 1.3 企业专线加密 · 严格遵循 ISO/IEC 27001 规范
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400">
        <p>© 2026 Lucas Enterprise Agent System. 内部企业系统，受企业数据资产保护体系约束。</p>
      </div>
    </div>
  );
};

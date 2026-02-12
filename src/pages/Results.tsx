import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Eye,
  FileText,
  Flame,
  Heart,
  MessageCircle,
  ShieldAlert,
  Share2,
  Sparkles,
  ThumbsUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadWithCredentials } from "@/lib/api";
import AuthMenu from "@/components/AuthMenu";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/useUser";

type AnalysisResult = {
  id: string;
  insights: unknown;
  numberOfLikes?: number | string;
  shared?: number | string;
  topComments?: unknown[];
  commentsCount?: number | string;
};

type InsightCard = {
  title: string;
  content: string;
};

const fallbackInsights: InsightCard[] = [
  {
    title: "Insights",
    content: "Envie um link para ver os insights gerados.",
  },
];

const normalizeInsights = (insights: unknown): InsightCard[] => {
  if (!insights) return fallbackInsights;

  const toText = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Date) return value.toISOString();
    return JSON.stringify(value);
  };

  if (Array.isArray(insights)) {
    const mapped = insights
      .map((item, index) => {
        if (typeof item === "string") {
          return { title: `Insight ${index + 1}`, content: item };
        }

        if (item && typeof item === "object") {
          const record = item as { title?: unknown; content?: unknown; text?: unknown };
          const titleText = typeof record.title === "string" ? record.title : toText(record.title);
          const contentSource = record.content ?? record.text ?? item;
          const contentText = typeof contentSource === "string" ? contentSource : toText(contentSource);
          return {
            title: titleText || `Insight ${index + 1}`,
            content: contentText || JSON.stringify(item),
          };
        }

        return null;
      })
      .filter((item): item is InsightCard => Boolean(item));

    return mapped.length ? mapped : fallbackInsights;
  }

  if (typeof insights === "string") {
    return [{ title: "Insights", content: insights }];
  }

  return [{ title: "Insights", content: JSON.stringify(insights) }];
};

type InsightPayload = {
  sentimentoGeral: string;
  principaisTemas: string[];
  fasVsHaters: {
    fas: number;
    neutros: number;
    haters: number;
    unidade: string;
  };
  gatilhosEngajamento: { gatilho: string; impacto: number }[];
  riscosReputacao: { alerta: string; severidade: string }[];
  topComentarios: { texto: string; sentimento?: string; tema?: string }[];
  polarizacaoPublico: { score: number; nivel: string };
  sugestoesAcao: string[];
  resumoQuantitativo: {
    likes?: number | string;
    shares?: number | string;
    comentarios?: number | string;
    alcanceEstimado?: number | string;
  };
};

const normalizeInsightPayload = (insights: unknown): InsightPayload => {
  const empty: InsightPayload = {
    sentimentoGeral: "Indefinido",
    principaisTemas: [],
    fasVsHaters: {
      fas: 0,
      neutros: 0,
      haters: 0,
      unidade: "percentual",
    },
    gatilhosEngajamento: [],
    riscosReputacao: [],
    topComentarios: [],
    polarizacaoPublico: {
      score: 0,
      nivel: "indefinido",
    },
    sugestoesAcao: [],
    resumoQuantitativo: {},
  };

  if (!insights || typeof insights !== "object") return empty;

  const record = insights as Partial<InsightPayload> & {
    fasVsHaters?: Partial<InsightPayload["fasVsHaters"]>;
    polarizacaoPublico?: Partial<InsightPayload["polarizacaoPublico"]>;
  };
  const toNumber = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace(",", ".").replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const toText = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Date) return value.toISOString();
    return JSON.stringify(value);
  };

  return {
    sentimentoGeral: typeof record.sentimentoGeral === "string" ? record.sentimentoGeral : toText(record.sentimentoGeral) || "Indefinido",
    principaisTemas: Array.isArray(record.principaisTemas) ? record.principaisTemas.map(toText).filter(Boolean) : [],
    fasVsHaters: {
      fas: toNumber(record.fasVsHaters?.fas),
      neutros: toNumber(record.fasVsHaters?.neutros),
      haters: toNumber(record.fasVsHaters?.haters),
      unidade: record.fasVsHaters?.unidade || "percentual",
    },
    gatilhosEngajamento: Array.isArray(record.gatilhosEngajamento)
      ? record.gatilhosEngajamento
          .map((item) => {
            if (typeof item === "string") return { gatilho: item, impacto: 0 };
            if (item && typeof item === "object") {
              const recordItem = item as { gatilho?: unknown; impacto?: unknown };
              return {
                gatilho: typeof recordItem.gatilho === "string" ? recordItem.gatilho : toText(recordItem.gatilho ?? item),
                impacto: toNumber(recordItem.impacto),
              };
            }
            return null;
          })
          .filter((item): item is { gatilho: string; impacto: number } => Boolean(item))
      : [],
    riscosReputacao: Array.isArray(record.riscosReputacao)
      ? record.riscosReputacao
          .map((item) => {
            if (typeof item === "string") return { alerta: item, severidade: "indefinida" };
            if (item && typeof item === "object") {
              const recordItem = item as { alerta?: unknown; severidade?: unknown };
              return {
                alerta: typeof recordItem.alerta === "string" ? recordItem.alerta : toText(recordItem.alerta ?? item),
                severidade: typeof recordItem.severidade === "string" ? recordItem.severidade : toText(recordItem.severidade) || "indefinida",
              };
            }
            return null;
          })
          .filter((item): item is { alerta: string; severidade: string } => Boolean(item))
      : [],
    topComentarios: Array.isArray(record.topComentarios) ? record.topComentarios : [],
    polarizacaoPublico: {
      score: toNumber(record.polarizacaoPublico?.score),
      nivel: typeof record.polarizacaoPublico?.nivel === "string" ? record.polarizacaoPublico?.nivel : toText(record.polarizacaoPublico?.nivel) || "indefinido",
    },
    sugestoesAcao: Array.isArray(record.sugestoesAcao) ? record.sugestoesAcao.map(toText).filter(Boolean) : [],
    resumoQuantitativo: record.resumoQuantitativo || {},
  };
};

type NormalizedComment = {
  text: string;
  likes?: number;
  sentiment?: string;
  theme?: string;
};

const normalizeComments = (comments: unknown[] | undefined): NormalizedComment[] => {
  if (!comments || !comments.length) return [];
  return comments
    .map((comment) => {
      if (typeof comment === "string") return { text: comment };
      if (comment && typeof comment === "object") {
        const record = comment as {
          text?: unknown;
          comment?: unknown;
          likes?: unknown;
          texto?: unknown;
          sentimento?: unknown;
          tema?: unknown;
        };
        const text =
          typeof record.text === "string"
            ? record.text
            : typeof record.comment === "string"
              ? record.comment
              : typeof record.texto === "string"
                ? record.texto
                : JSON.stringify(comment);
        const likes = typeof record.likes === "number" ? record.likes : Number(record.likes);
        const sentiment = typeof record.sentimento === "string" ? record.sentimento : undefined;
        const theme = typeof record.tema === "string" ? record.tema : undefined;
        return { text, likes: Number.isFinite(likes) ? likes : undefined, sentiment, theme };
      }
      return { text: String(comment) };
    })
    .filter((item) => item.text.length);
};

const parseCount = (value: number | string | undefined) => {
  if (value === undefined) return 0;
  if (typeof value === "number") return value;
  const parsed = Number(value.replace(",", ".").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));
const formatMetricValue = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "0";
  if (typeof value === "number") return value.toLocaleString("pt-BR");
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== "string") return JSON.stringify(value);
  return value;
};

const asText = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
};

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAuthenticated, logout } = useSession();
  const { user } = useUser();
  const displayName = user?.nome || user?.email || session?.usuario.nome || session?.usuario.email || "Utilizador";
  const displayEmail = user?.email || session?.usuario.email;
  const analysis = (location.state as { analysis?: AnalysisResult } | null)?.analysis;

  const rawInsights = analysis?.insights ?? (analysis as unknown);
  const insightPayload = useMemo(() => normalizeInsightPayload(rawInsights), [rawInsights]);
  const fallbackCards = useMemo(() => normalizeInsights(rawInsights), [rawInsights]);
  const topComments = useMemo(
    () => normalizeComments(insightPayload.topComentarios.length ? insightPayload.topComentarios : analysis?.topComments),
    [analysis?.topComments, insightPayload.topComentarios]
  );

  const likesRaw = insightPayload.resumoQuantitativo.likes ?? analysis?.numberOfLikes;
  const sharesRaw = insightPayload.resumoQuantitativo.shares ?? analysis?.shared;
  const commentsRaw = insightPayload.resumoQuantitativo.comentarios ?? analysis?.commentsCount;
  const reachRaw = insightPayload.resumoQuantitativo.alcanceEstimado;

  const likesCount = useMemo(() => parseCount(likesRaw), [likesRaw]);
  const shareCount = useMemo(() => parseCount(sharesRaw), [sharesRaw]);
  const engagementScore = useMemo(() => likesCount + shareCount, [likesCount, shareCount]);

  const metricCards = useMemo(
    () => {
      const cards = [
        { label: "Likes", value: formatMetricValue(likesRaw), icon: Heart },
        { label: "Partilhas", value: formatMetricValue(sharesRaw), icon: Share2 },
        { label: "Comentarios analisados", value: formatMetricValue(commentsRaw), icon: MessageCircle },
        { label: "Top comentarios", value: topComments.length, icon: ThumbsUp },
        { label: "Engajamento", value: formatMetricValue(engagementScore), icon: BarChart3 },
        { label: "Alcance estimado", value: formatMetricValue(reachRaw), icon: Eye },
      ];

      return cards.filter((item) => {
        if (item.label === "Comentarios analisados") return true;
        if (typeof item.value === "number") return item.value > 0;
        return item.value !== "0";
      });
    },
    [likesRaw, sharesRaw, commentsRaw, reachRaw, topComments.length, engagementScore]
  );

  const audience = insightPayload.fasVsHaters;
  const positivePercent = clampPercent(audience.fas);
  const neutralPercent = clampPercent(audience.neutros);
  const negativePercent = clampPercent(audience.haters);
  const sentimentTotal = positivePercent + neutralPercent + negativePercent;
  const sentimentScale = sentimentTotal > 0 ? 100 / sentimentTotal : 1;
  const positiveWidth = sentimentTotal > 0 ? positivePercent * sentimentScale : 0;
  const neutralWidth = sentimentTotal > 0 ? neutralPercent * sentimentScale : 0;
  const negativeWidth = sentimentTotal > 0 ? negativePercent * sentimentScale : 0;

  const riskStyle = (level: string) => {
    const value = level.toLowerCase();
    if (value.includes("alta")) return "border-rose-500/40 bg-rose-500/15 text-rose-200";
    if (value.includes("media")) return "border-amber-400/40 bg-amber-400/15 text-amber-100";
    if (value.includes("baixa")) return "border-emerald-400/40 bg-emerald-400/15 text-emerald-100";
    return "border-slate-400/40 bg-slate-400/15 text-slate-200";
  };

  const handleExport = async (format: "pdf" | "excel") => {
    if (!analysis?.id) {
      toast.error("Nenhuma analise para exportar.");
      return;
    }

    try {
      const filename = `insights.${format === "pdf" ? "pdf" : "xlsx"}`;
      await downloadWithCredentials(`/export/${format}/${analysis.id}`, filename);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao exportar arquivo.");
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 opacity-95" />
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />

      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Eye className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">OC Tech</span>
          </button>
          <div className="flex items-center gap-3">
            {isAuthenticated && session ? <AuthMenu session={session} onLogout={logout} /> : null}
            <Button variant="ghost" size="sm" onClick={() => navigate("/analisar")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Nova Analise
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-12 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">Painel de Insights</h1>
            <p className="text-muted-foreground text-sm mt-1">Resultados da analise da publicacao.</p>
            {isAuthenticated && session ? (
              <p className="text-muted-foreground text-xs mt-2">
                Sessao ativa: <span className="font-semibold text-foreground">{displayName}</span>
                {displayEmail && displayEmail !== displayName ? ` - ${displayEmail}` : ""}
              </p>
            ) : null}
            {likesRaw !== undefined || sharesRaw !== undefined || commentsRaw !== undefined ? (
              <p className="text-muted-foreground text-xs mt-2">Relatorio completo do desempenho da publicacao.</p>
            ) : null}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-secondary"
              onClick={() => handleExport("pdf")}
              disabled={!analysis?.id}
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            {/*
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-secondary"
              onClick={() => handleExport("excel")}
              disabled={!analysis?.id}
            >              Exportar Excel
            </Button>
            */}
          </div>
        </div>

        {analysis ? (
          <div className="space-y-10">
            {metricCards.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metricCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur card-glow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                        <p className="text-2xl font-semibold mt-1">{asText(item.value)}</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-emerald-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Distribuicao do publico</h3>
</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Fas
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    Neutros
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Haters
                  </span>
                </div>
              </div>
              <div className="mt-5 h-4 w-full rounded-full bg-secondary/70 overflow-hidden">
                <div className="flex h-full w-full">
                  <div
                    className="h-full bg-emerald-400/90"
                    style={{ width: `${positiveWidth}%` }}
                    aria-label={`Fas ${positivePercent}%`}
                  />
                  <div
                    className="h-full bg-slate-300/80"
                    style={{ width: `${neutralWidth}%` }}
                    aria-label={`Neutros ${neutralPercent}%`}
                  />
                  <div
                    className="h-full bg-rose-400/90"
                    style={{ width: `${negativeWidth}%` }}
                    aria-label={`Haters ${negativePercent}%`}
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Fas</p>
                  <p className="text-lg font-semibold">{positivePercent}%</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Neutros</p>
                  <p className="text-lg font-semibold">{neutralPercent}%</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Haters</p>
                  <p className="text-lg font-semibold">{negativePercent}%</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Sentimento geral</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{asText(insightPayload.sentimentoGeral || "Indefinido")}</p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Fas vs Haters</h3>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
                    <p className="text-xs">Fas</p>
                    <p className="text-lg font-semibold text-emerald-200">{positivePercent}%</p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
                    <p className="text-xs">Neutros</p>
                    <p className="text-lg font-semibold">{neutralPercent}%</p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2">
                    <p className="text-xs">Haters</p>
                    <p className="text-lg font-semibold text-rose-200">{negativePercent}%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Principais temas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insightPayload.principaisTemas.length ? (
                    insightPayload.principaisTemas.map((tema, idx) => (
                      <span key={`${asText(tema)}-${idx}`} className="px-3 py-1 rounded-full text-xs bg-secondary text-foreground">
                        {asText(tema)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem temas detectados.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Gatilhos de engajamento</h3>
                </div>
                {insightPayload.gatilhosEngajamento.length ? (
                  <div className="space-y-3">
                    {insightPayload.gatilhosEngajamento.map((gatilho, idx) => (
                      <div key={`${asText(gatilho.gatilho)}-${idx}`} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{asText(gatilho.gatilho)}</span>
                          <span className="text-emerald-200 font-semibold">{gatilho.impacto}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-secondary/80 overflow-hidden">
                          <div className="h-full bg-emerald-400/90" style={{ width: `${clampPercent(gatilho.impacto)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum gatilho identificado.</p>
                )}
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Polarizacao do publico</h3>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Nivel: {insightPayload.polarizacaoPublico.nivel}</span>
                  <span className="text-emerald-200 font-semibold">{insightPayload.polarizacaoPublico.score}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-secondary/80 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400/90"
                    style={{ width: `${clampPercent(insightPayload.polarizacaoPublico.score)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Riscos de reputacao</h3>
                </div>
                {insightPayload.riscosReputacao.length ? (
                  <div className="space-y-3">
                    {insightPayload.riscosReputacao.map((risco, idx) => (
                      <div key={`${asText(risco.alerta)}-${idx}`} className={`rounded-lg border p-3 ${riskStyle(risco.severidade)}`}>
                        <p className="text-sm">{asText(risco.alerta)}</p>
                        <p className="text-xs uppercase tracking-wide mt-2">Severidade: {asText(risco.severidade)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum risco relevante encontrado.</p>
                )}
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-emerald-300" />
                  <h3 className="font-semibold">Sugestoes de acao</h3>
                </div>
                {insightPayload.sugestoesAcao.length ? (
                  <div className="space-y-2">
                    {insightPayload.sugestoesAcao.map((acao, idx) => (
                      <div key={`${asText(acao)}-${idx}`} className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                        {asText(acao)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma sugestÃ£o adicional.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow">
              <div className="flex items-center gap-3 mb-4">
                <ThumbsUp className="h-5 w-5 text-emerald-300" />
                <h3 className="font-semibold">Top comentarios</h3>
              </div>
              {topComments.length ? (
                <div className="space-y-3">
                  {topComments.map((comment, idx) => (
                    <div key={`${asText(comment.text)}-${idx}`} className="rounded-lg border border-border/60 bg-secondary/40 p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {comment.sentiment ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-200">
                            {asText(comment.sentiment)}
                          </span>
                        ) : null}
                        {comment.theme ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-500/20 text-slate-200">
                            {asText(comment.theme)}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{asText(comment.text)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum comentario destacado.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackCards.map((insight, i) => (
              <div
                key={`${asText(insight.title)}-${i}`}
                className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur card-glow animate-fade-in"
                style={{ animationDelay: `${0.08 * (i + 1)}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-emerald-300" />
                  <h3 className="font-semibold">{asText(insight.title)}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{asText(insight.content)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          (c) 2026 OC Tech - Olho Critico. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Results;


























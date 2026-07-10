"use client";

import { useRef, useState } from "react";
import type { DashboardData } from "@/types";
import QuoteCard from "@/components/QuoteCard";
import StatsHeader from "@/components/StatsHeader";
import HabitList from "@/components/HabitList";
import GoalsList from "@/components/GoalsList";
import GymCard from "@/components/GymCard";
import CaloriesCard from "@/components/CaloriesCard";
import StepsCard from "@/components/StepsCard";
import BadgesGrid from "@/components/BadgesGrid";
import AddHabitModal from "@/components/AddHabitModal";
import Toast from "@/components/Toast";

async function api(path: string, body?: unknown) {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed`);
  return res.json();
}

export default function Dashboard({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGoalsComplete = useRef<Set<string>>(
    new Set(initialData.habits.filter((h) => h.meta > 0 && h.progresoMes >= h.meta).map((h) => h.id))
  );

  function showToast(msg: string) {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2500);
  }

  async function refresh() {
    const fresh: DashboardData = await api("/api/dashboard");

    const nowComplete = new Set(fresh.habits.filter((h) => h.meta > 0 && h.progresoMes >= h.meta).map((h) => h.id));
    const newlyCompleted = fresh.habits.find((h) => nowComplete.has(h.id) && !lastGoalsComplete.current.has(h.id));
    lastGoalsComplete.current = nowComplete;

    setData(fresh);
    return { fresh, newlyCompletedGoal: newlyCompleted };
  }

  async function handleToggle(id: string) {
    const res = await api(`/api/habits/${id}/toggle`, {});
    const { newlyCompletedGoal } = await refresh();
    if (res.newlyUnlockedBadges?.length > 0) {
      showToast(`🏆 ¡Logro desbloqueado: ${res.newlyUnlockedBadges[0].nombre}!`);
    } else if (newlyCompletedGoal) {
      showToast(`🎯 ¡Meta mensual alcanzada: ${newlyCompletedGoal.nombre}!`);
    }
  }

  async function deleteHabit(id: string) {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function handleCreate(nombre: string, icono: string, categoria: string, dificultad: string) {
    await api("/api/habits", { nombre, icono, categoria, dificultad });
    await refresh();
  }

  async function handleSetMeta(id: string, meta: number) {
    await fetch(`/api/habits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meta }),
    });
    const { newlyCompletedGoal } = await refresh();
    if (newlyCompletedGoal) showToast(`🎯 ¡Meta mensual alcanzada: ${newlyCompletedGoal.nombre}!`);
  }

  async function handleSaveGym(
    entreno: boolean,
    calificacion: number,
    cardio: boolean,
    cardioMinutos: number,
    cardioIntensidad: string
  ) {
    const res = await api("/api/gym", { entreno, calificacion, cardio, cardioMinutos, cardioIntensidad });
    await refresh();
    if (res.newlyUnlockedBadges?.length > 0) {
      showToast(`🏆 ¡Logro desbloqueado: ${res.newlyUnlockedBadges[0].nombre}!`);
    }
  }

  async function handleSaveCalories(calorias: number) {
    await api("/api/calories", { calorias });
    await refresh();
  }

  async function handleSaveSteps(pasos: number) {
    await api("/api/steps", { pasos });
    await refresh();
  }

  return (
    <div>
      <QuoteCard quote={data.quote} />
      <StatsHeader stats={data.stats} />

      <SectionTitle title="Hábitos de hoy" action={<AddHabitModal onCreate={handleCreate} />} />
      <HabitList habits={data.habits} onToggle={handleToggle} onDelete={deleteHabit} />

      <SectionTitle title="🎯 Metas mensuales" />
      <GoalsList habits={data.habits} onSetMeta={handleSetMeta} />

      <SectionTitle title="💪 Gimnasio de hoy" />
      <GymCard key={data.todayKey} gym={data.gym} onSave={handleSaveGym} />

      <SectionTitle title="⌚ Calorías (Smartwatch)" />
      <CaloriesCard
        weeklyCalories={data.weeklyCalories}
        weeklyCaloriesTotal={data.weeklyCaloriesTotal}
        onSave={handleSaveCalories}
      />

      <SectionTitle title="🚶 Pasos diarios (Smartwatch)" />
      <StepsCard
        weeklySteps={data.weeklySteps}
        weeklyStepsTotal={data.weeklyStepsTotal}
        onSave={handleSaveSteps}
      />

      <SectionTitle title="Logros" />
      <BadgesGrid badges={data.badges} />

      <Toast message={toastMsg} />
    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-[11px] uppercase tracking-wide text-text-dim mt-4.5 mb-2">
      <span>{title}</span>
      {action}
    </div>
  );
}

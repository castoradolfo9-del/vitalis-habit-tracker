export interface Quote {
  texto: string;
  autor: string;
}

export const QUOTES: Quote[] = [
  { texto: "Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás fuerza.", autor: "Marco Aurelio" },
  { texto: "La felicidad de tu vida depende de la calidad de tus pensamientos.", autor: "Marco Aurelio" },
  { texto: "Lo que se interpone en el camino se convierte en el camino.", autor: "Marco Aurelio" },
  { texto: "Cuando te levantes por la mañana, piensa en el privilegio de estar vivo: respirar, pensar, disfrutar, amar.", autor: "Marco Aurelio" },
  { texto: "El mejor modo de vengarte es no parecerte a quien te ofendió.", autor: "Marco Aurelio" },
  { texto: "Muy poco se necesita para hacer una vida feliz; todo está dentro de ti, en tu manera de pensar.", autor: "Marco Aurelio" },
  { texto: "No actúes como si fueras a vivir diez mil años. Mientras vivas, mientras puedas, hazte bueno.", autor: "Marco Aurelio" },
  { texto: "Nuestra vida es lo que nuestros pensamientos hacen de ella.", autor: "Marco Aurelio" },
  { texto: "Si no es correcto, no lo hagas. Si no es verdad, no lo digas.", autor: "Marco Aurelio" },
  { texto: "Acepta las cosas a las que el destino te ata, y ama a las personas con quienes te junta, pero hazlo con todo tu corazón.", autor: "Marco Aurelio" },
  { texto: "No es que tengamos poco tiempo, sino que perdemos mucho.", autor: "Séneca" },
  { texto: "Mientras estemos posponiendo, la vida pasa.", autor: "Séneca" },
  { texto: "Ningún viento es favorable para el que no sabe a qué puerto se dirige.", autor: "Séneca" },
  { texto: "No es pobre el que tiene poco, sino el que desea más.", autor: "Séneca" },
  { texto: "A veces también vivir es un acto de valentía.", autor: "Séneca" },
  { texto: "Nada me parece más desdichado que aquel que nunca ha experimentado la adversidad.", autor: "Séneca" },
  { texto: "Encontrarás la cura del dolor en la razón, si quieres curarte.", autor: "Séneca" },
  { texto: "El que teme a la muerte nunca hará nada digno de un hombre vivo.", autor: "Séneca" },
  { texto: "Un camino a través de la teoría es largo, pero corto y eficaz a través de los ejemplos.", autor: "Séneca" },
  { texto: "La mayoría de la gente teme más a la crítica de lo que desea la verdad.", autor: "Séneca" },
  { texto: "No son las cosas las que perturban a los hombres, sino los juicios que se forman sobre ellas.", autor: "Epicteto" },
  { texto: "Solo hay un camino a la felicidad: dejar de preocuparse por las cosas que están más allá de nuestro poder.", autor: "Epicteto" },
  { texto: "Primero decide quién quieres ser, y después haz lo que tengas que hacer.", autor: "Epicteto" },
  { texto: "Es la marca de una mente educada poder entretener un pensamiento sin aceptarlo.", autor: "Epicteto" },
  { texto: "No expliques tu filosofía. Encárnala.", autor: "Epicteto" },
  { texto: "Las circunstancias no hacen al hombre, solo lo revelan a sí mismo.", autor: "Epicteto" },
  { texto: "Ningún hombre es libre si no es dueño de sí mismo.", autor: "Epicteto" },
  { texto: "La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades.", autor: "Epicteto" },
  { texto: "Primero aprende el significado de lo que dices, y luego habla.", autor: "Epicteto" },
  { texto: "No pidas que las cosas sucedan como tú quieres, sino desea que sucedan como suceden, y tendrás paz.", autor: "Epicteto" },
];

export function getDailyQuote(): Quote {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const idx = Math.floor((now.getTime() - start.getTime()) / 86400000) % QUOTES.length;
  return QUOTES[idx];
}

import { Course, Lesson } from "./types";
import { circle, ellipse, petal, star } from "./shapes";

export const INTRO: Course = {
  id: "intro",
  kind: "intro",
  name: "Primeros trazos",
  tagline: "Las bases para dibujar cualquier cosa",
  color: "#5B6CFF",
  soft: "#ECEEFF",
  lessons: [
    {
      id: "intro-shapes",
      title: "Líneas y formas",
      difficulty: "Básico",
      skill: {
        name: "Formas básicas",
        description: "Casi todo lo que dibujes empieza con líneas, círculos, cuadrados y triángulos.",
      },
      steps: [
        {
          instruction: "Traza tres líneas: dos rectas y una curva. Hazlas despacio y sin apretar el lápiz.",
          tip: "Mueve todo el brazo, no solo la muñeca.",
          paths: ["M30 30 H170", "M30 48 H170", "M30 70 Q100 50 170 70"],
        },
        {
          instruction: "Dibuja un círculo. Gira el papel si te ayuda a cerrarlo bien.",
          tip: "No importa si no queda perfecto: puedes repasarlo.",
          paths: [circle(52, 125, 28)],
        },
        {
          instruction: "Ahora un cuadrado: cuatro lados del mismo tamaño.",
          paths: ["M88 97 H138 V153 H88 Z"],
        },
        {
          instruction: "Termina con un triángulo. ¡Ya conoces las formas que usarás en todas las lecciones!",
          paths: ["M168 97 L196 153 H140 Z"],
        },
      ],
      checklist: [
        "Dibujé líneas rectas y una curva",
        "Mi círculo quedó cerrado",
        "El cuadrado y el triángulo tienen sus lados completos",
      ],
      extraPractice: "Llena una hoja con círculos de distintos tamaños.",
    },
    {
      id: "intro-apple",
      title: "Una manzana",
      difficulty: "Básico",
      skill: {
        name: "Contorno, sombra y detalles",
        description: "Primero se dibuja el borde, luego la sombra le da volumen y los detalles la terminan.",
      },
      steps: [
        {
          instruction: "Dibuja el contorno de la manzana: como un corazón muy redondo, más ancho arriba.",
          tip: "Traza suave; luego podrás repasar la línea buena.",
          paths: ["M100 62 C70 40 32 60 36 110 C40 160 80 186 100 170 C120 186 160 160 164 110 C168 60 130 40 100 62 Z"],
        },
        {
          instruction: "Agrega el palito arriba y una hoja a un lado.",
          paths: ["M100 62 Q98 42 106 28", "M104 42 Q125 22 146 32 Q126 50 104 42 Z"],
        },
        {
          instruction: "Sombra: haz rayitas inclinadas en el lado derecho. Así la manzana se ve redonda.",
          tip: "Todas las rayitas van en la misma dirección.",
          paths: ["M146 92 L158 106", "M141 108 L157 126", "M135 124 L152 142", "M126 140 L142 156"],
        },
        {
          instruction: "Detalles: un brillo curvo a la izquierda y la vena de la hoja. ¡Lista!",
          paths: ["M60 86 Q54 100 60 116", "M106 41 Q126 34 142 32"],
        },
      ],
      checklist: [
        "El contorno de la manzana está cerrado",
        "Las rayitas de sombra van en la misma dirección",
        "Agregué el brillo y la hoja",
      ],
      extraPractice: "Dibuja una pera usando los mismos tres pasos: contorno, sombra y detalles.",
    },
  ],
};

const animals: Lesson[] = [
  {
    id: "animals-basic",
    title: "Gato simpático",
    difficulty: "Básico",
    skill: { name: "Construir con círculos", description: "Un círculo grande para la cabeza y uno para el cuerpo forman casi cualquier animal." },
    steps: [
      { instruction: "Dibuja un círculo grande arriba. Será la cabeza del gato.", paths: [circle(100, 80, 40)] },
      { instruction: "Agrega dos orejas en forma de triángulo encima de la cabeza.", paths: ["M68 57 L72 22 L95 42", "M132 57 L128 22 L105 42"] },
      {
        instruction: "Dibuja los ojos, una nariz de triángulo y los bigotes a cada lado.",
        tip: "Los bigotes salen de la nariz hacia afuera.",
        paths: [circle(83, 78, 5), circle(117, 78, 5), "M95 92 H105 L100 98 Z", "M92 98 L60 94 M92 102 L60 106 M108 98 L140 94 M108 102 L140 106"],
      },
      { instruction: "Haz el cuerpo ovalado debajo y una cola curva. ¡Miau!", paths: [ellipse(100, 158, 38, 32), "M138 165 Q176 160 170 125 Q167 110 178 104"] },
    ],
    checklist: ["La cabeza y el cuerpo son redondos", "Las orejas están arriba de la cabeza", "Tiene ojos, nariz, bigotes y cola"],
    extraPractice: "Dibuja el mismo gato durmiendo: ojos como líneas curvas y la cola alrededor del cuerpo.",
  },
  {
    id: "animals-intermediate",
    title: "Elefante amigable",
    difficulty: "Intermedio",
    skill: { name: "Proporciones", description: "Comparar tamaños: el cuerpo del elefante es mucho más grande que su cabeza." },
    steps: [
      { instruction: "Dibuja un óvalo grande y acostado para el cuerpo.", paths: [ellipse(90, 110, 55, 38)] },
      {
        instruction: "Agrega la cabeza a la derecha y una trompa larga que baja.",
        paths: [circle(150, 85, 28), "M176 97 Q190 130 176 168", "M160 112 Q172 138 164 168", "M164 168 H176"],
      },
      { instruction: "Dibuja cuatro patas gruesas como rectángulos.", paths: ["M50 136 V180 H68 V143", "M78 146 V182 H96 V148", "M108 147 V182 H126 V146", "M132 135 V180 H148 V113"] },
      {
        instruction: "Termina con una oreja grande, el ojo y una colita.",
        paths: ["M140 68 Q108 60 114 96 Q124 116 146 102", circle(158, 78, 3), "M36 104 Q22 114 26 130", "M24 128 L20 136 M27 130 L27 138"],
      },
    ],
    checklist: ["El cuerpo es más grande que la cabeza", "La trompa sale de la cabeza", "Tiene cuatro patas, oreja y cola"],
    extraPractice: "Dibuja un elefante bebé al lado: misma forma, pero más pequeño.",
  },
];

const nature: Lesson[] = [
  {
    id: "nature-basic",
    title: "Árbol del bosque",
    difficulty: "Básico",
    skill: { name: "Capas", description: "Repetir una forma una sobre otra crea volumen, como las ramas de un pino." },
    steps: [
      { instruction: "Dibuja el tronco: un rectángulo alto abajo y al centro.", paths: ["M88 190 V130 H112 V190 Z"] },
      { instruction: "Encima del tronco, un triángulo grande.", paths: ["M40 135 L100 70 L160 135 Z"] },
      { instruction: "Agrega dos triángulos más pequeños, uno encima del otro.", paths: ["M55 96 L100 45 L145 96", "M70 60 L100 20 L130 60"] },
      {
        instruction: "Raya la corteza del tronco y dibuja algunos frutos redondos.",
        paths: ["M95 148 Q98 160 95 172", "M105 140 Q102 152 106 162", circle(80, 112, 4), circle(118, 120, 4), circle(100, 84, 4)],
      },
    ],
    checklist: ["El tronco está centrado", "Hay tres triángulos en capas", "Agregué corteza y frutos"],
    extraPractice: "Dibuja un bosque con tres árboles de diferente altura.",
  },
  {
    id: "nature-intermediate",
    title: "Flor de jardín",
    difficulty: "Intermedio",
    skill: { name: "Simetría", description: "Repartir los pétalos de forma pareja alrededor del centro." },
    steps: [
      { instruction: "Dibuja un círculo pequeño. Es el centro de la flor.", paths: [circle(100, 70, 14)] },
      {
        instruction: "Dibuja seis pétalos alrededor del centro, separados por igual.",
        tip: "Primero arriba y abajo, luego los de los lados.",
        paths: [0, 60, 120, 180, 240, 300].map((a) => petal(100, 70, a - 90, 14, 40, 14)),
      },
      {
        instruction: "Traza el tallo hacia abajo y dos hojas.",
        paths: ["M100 124 Q96 155 100 192", "M99 150 Q70 130 60 145 Q75 160 99 150 Z", "M100 170 Q130 150 140 165 Q125 180 100 170 Z"],
      },
      {
        instruction: "Llena el centro de puntitos y marca una línea en cada pétalo.",
        paths: [circle(95, 66, 1.5), circle(105, 68, 1.5), circle(99, 75, 1.5), ...[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const x1 = Math.round((100 + Math.cos(rad) * 22) * 10) / 10;
          const y1 = Math.round((70 + Math.sin(rad) * 22) * 10) / 10;
          const x2 = Math.round((100 + Math.cos(rad) * 40) * 10) / 10;
          const y2 = Math.round((70 + Math.sin(rad) * 40) * 10) / 10;
          return `M${x1} ${y1} L${x2} ${y2}`;
        })],
      },
    ],
    checklist: ["Los pétalos están repartidos parejo", "El tallo sale del centro de la flor", "Agregué hojas y detalles"],
    extraPractice: "Dibuja una flor con ocho pétalos más delgados.",
  },
];

const objects: Lesson[] = [
  {
    id: "objects-basic",
    title: "Casa acogedora",
    difficulty: "Básico",
    skill: { name: "Líneas rectas", description: "Las casas se construyen con rectángulos y triángulos bien alineados." },
    steps: [
      { instruction: "Dibuja un rectángulo grande para la base de la casa.", paths: ["M45 100 H155 V185 H45 Z"] },
      { instruction: "Encima, un triángulo un poco más ancho que la base: el techo.", paths: ["M35 100 L100 45 L165 100 Z"] },
      { instruction: "Agrega la puerta en el centro y una ventana a cada lado.", paths: ["M88 185 V140 H112 V185", "M55 115 H80 V140 H55 Z", "M120 115 H145 V140 H120 Z"] },
      {
        instruction: "Termina con la chimenea, la manija y las cruces de las ventanas.",
        paths: ["M125 66 V40 H140 V79", circle(107, 163, 2), "M67.5 115 V140 M55 127.5 H80", "M132.5 115 V140 M120 127.5 H145", "M59 80 H141"],
      },
    ],
    checklist: ["La base y el techo tienen el mismo centro", "Puerta y ventanas están dentro de la casa", "Agregué chimenea y detalles"],
    extraPractice: "Dibuja tu propia casa o la de alguien que quieras.",
  },
  {
    id: "objects-intermediate",
    title: "Cohete espacial",
    difficulty: "Intermedio",
    skill: { name: "Movimiento", description: "Las llamas y las estrellas hacen que un dibujo quieto parezca moverse." },
    steps: [
      { instruction: "Dibuja un rectángulo alto: el cuerpo del cohete.", paths: ["M80 60 H120 V150 H80 Z"] },
      { instruction: "Arriba, una punta curva que termine en el centro.", paths: ["M80 60 Q86 32 100 18 Q114 32 120 60"] },
      { instruction: "Agrega una aleta a cada lado de la parte de abajo.", paths: ["M80 118 L58 156 L80 150", "M120 118 L142 156 L120 150"] },
      {
        instruction: "Dibuja la ventanilla, las llamas abajo y estrellas alrededor. ¡Despegue!",
        paths: [circle(100, 92, 12), "M85 150 Q90 176 100 188 Q110 176 115 150", "M93 150 Q97 166 100 174 Q103 166 107 150", star(40, 40, 10), star(165, 55, 8), star(160, 170, 9)],
      },
    ],
    checklist: ["El cuerpo es recto y la punta está centrada", "Las dos aletas son parecidas", "Tiene ventanilla, llamas y estrellas"],
    extraPractice: "Dibuja el cohete volando inclinado hacia un planeta.",
  },
];

const faces: Lesson[] = [
  {
    id: "faces-basic",
    title: "Cara feliz",
    difficulty: "Básico",
    skill: { name: "Expresiones", description: "Los ojos, las cejas y la boca cuentan cómo se siente un personaje." },
    steps: [
      { instruction: "Dibuja un círculo grande: la cara.", paths: [circle(100, 105, 65)] },
      {
        instruction: "Dibuja dos ojos redondos con su pupila y un puntito de brillo.",
        paths: [circle(75, 92, 12), circle(125, 92, 12), circle(75, 94, 5), circle(125, 94, 5), circle(72, 89, 1.5), circle(122, 89, 1.5)],
      },
      { instruction: "Agrega la nariz pequeña y una gran sonrisa.", paths: ["M95 114 Q100 122 105 114", "M70 132 Q100 160 130 132"] },
      {
        instruction: "Termina con el cabello y unas cejas felices. ¡Sonríe!",
        paths: ["M38 92 Q45 40 100 40 Q155 40 162 92", "M60 56 Q75 66 80 46 M90 44 Q100 62 112 43 M120 46 Q132 62 142 56", "M63 74 Q75 66 87 74", "M113 74 Q125 66 137 74"],
      },
    ],
    checklist: ["Los ojos están a la misma altura", "La boca y la nariz están centradas", "Agregué cabello y cejas"],
    extraPractice: "Dibuja la misma cara sorprendida: boca redonda y cejas altas.",
  },
  {
    id: "faces-intermediate",
    title: "Superhéroe",
    difficulty: "Intermedio",
    skill: { name: "Personajes con actitud", description: "La postura y los detalles del traje muestran quién es tu personaje." },
    steps: [
      { instruction: "Dibuja un óvalo para la cabeza y el torso debajo, más ancho en los hombros.", paths: [ellipse(100, 62, 28, 32), "M55 100 Q100 88 145 100 L135 182 H65 Z"] },
      {
        instruction: "Agrega el antifaz sobre los ojos.",
        paths: ["M72 57 Q86 47 100 57 Q114 47 128 57 Q128 70 114 68 Q100 64 86 68 Q72 70 72 57 Z", ellipse(87, 59, 5, 3), ellipse(113, 59, 5, 3)],
      },
      { instruction: "Dibuja el cabello en puntas y la capa detrás de los hombros.", paths: ["M72 46 L76 24 L86 36 L95 18 L104 34 L114 18 L120 36 L128 46", "M55 100 Q30 150 35 190", "M145 100 Q170 150 165 190"] },
      {
        instruction: "Pon tu símbolo en el pecho y dibuja los brazos con los puños. ¡Al rescate!",
        paths: ["M106 115 L92 140 H104 L96 164 L114 132 H102 L110 115 Z", "M57 102 Q38 125 45 147", "M143 102 Q162 125 155 147", circle(45, 155, 8), circle(155, 155, 8)],
      },
    ],
    checklist: ["La cabeza es más pequeña que el torso", "Tiene antifaz, cabello y capa", "Inventé un símbolo para el pecho"],
    extraPractice: "Inventa un compañero para tu héroe con otro símbolo y otro peinado.",
  },
];

export const PATHS: Course[] = [
  { id: "animals", kind: "path", name: "Animales", tagline: "Mascotas y animales salvajes", color: "#FF8A5B", soft: "#FFEFE7", lessons: animals },
  { id: "nature", kind: "path", name: "Naturaleza", tagline: "Árboles, flores y paisajes", color: "#2FB57F", soft: "#E3F6EE", lessons: nature },
  { id: "objects", kind: "path", name: "Objetos y vehículos", tagline: "Casas, cohetes y más", color: "#8C6CF0", soft: "#F0EBFF", lessons: objects },
  { id: "faces", kind: "path", name: "Rostros y personajes", tagline: "Caras, expresiones y héroes", color: "#EDA521", soft: "#FFF5DD", lessons: faces },
];

export const COURSES: Course[] = [INTRO, ...PATHS];

export function findCourse(id: string | undefined): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function findLesson(lessonId: string | undefined): { course: Course; lesson: Lesson; index: number } | undefined {
  for (const course of COURSES) {
    const index = course.lessons.findIndex((l) => l.id === lessonId);
    if (index >= 0) return { course, lesson: course.lessons[index], index };
  }
  return undefined;
}

export function allPaths(lesson: Lesson): string[] {
  return lesson.steps.flatMap((s) => s.paths);
}

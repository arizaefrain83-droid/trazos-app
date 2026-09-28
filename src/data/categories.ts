import { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "animals",
    name: "Animales",
    emoji: "🐾",
    color: "#FF7B54",
    levels: [
      {
        id: "animals-basic",
        title: "Gato Simpático",
        difficulty: "Básico",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un círculo grande en el centro del papel. Este será la cabeza de tu gato.",
            imageKey: "cat_step1",
          },
          {
            id: 2,
            instruction: "Agrega dos triángulos pequeños en la parte superior del círculo como orejas puntiagudas.",
            imageKey: "cat_step2",
          },
          {
            id: 3,
            instruction: "Dibuja dos ojos redondos, una nariz pequeña en forma de triángulo y bigotes rectos a los lados.",
            imageKey: "cat_step3",
          },
          {
            id: 4,
            instruction: "Añade el cuerpo ovalado debajo de la cabeza y una cola curvada. ¡Tu gato está listo!",
            imageKey: "cat_step4",
          },
        ],
      },
      {
        id: "animals-intermediate",
        title: "Elefante Amigable",
        difficulty: "Intermedio",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un óvalo grande horizontal para el cuerpo del elefante.",
            imageKey: "elephant_step1",
          },
          {
            id: 2,
            instruction: "Agrega un círculo más pequeño a la derecha del cuerpo para la cabeza, y una trompa larga que se curve hacia abajo.",
            imageKey: "elephant_step2",
          },
          {
            id: 3,
            instruction: "Dibuja cuatro patas rectangulares debajo del cuerpo. Las de adelante un poco más adelante que las de atrás.",
            imageKey: "elephant_step3",
          },
          {
            id: 4,
            instruction: "Añade orejas grandes y redondeadas, un ojo pequeño, y una cola corta con pelitos al final. ¡Listo tu elefante!",
            imageKey: "elephant_step4",
          },
        ],
      },
    ],
  },
  {
    id: "nature",
    name: "Naturaleza",
    emoji: "🌿",
    color: "#4CAF87",
    levels: [
      {
        id: "nature-basic",
        title: "Árbol del Bosque",
        difficulty: "Básico",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un rectángulo vertical en el centro del papel. Este es el tronco del árbol.",
            imageKey: "tree_step1",
          },
          {
            id: 2,
            instruction: "Sobre el tronco, dibuja un triángulo grande. Esta es la copa del árbol.",
            imageKey: "tree_step2",
          },
          {
            id: 3,
            instruction: "Agrega dos triángulos más pequeños encima del primero para dar volumen a la copa.",
            imageKey: "tree_step3",
          },
          {
            id: 4,
            instruction: "Dibuja líneas en el tronco para simular la corteza y algunos círculos pequeños en la copa como frutos o flores.",
            imageKey: "tree_step4",
          },
        ],
      },
      {
        id: "nature-intermediate",
        title: "Flor de Jardín",
        difficulty: "Intermedio",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un círculo pequeño en el centro de tu papel. Este será el centro de la flor.",
            imageKey: "flower_step1",
          },
          {
            id: 2,
            instruction: "Alrededor del círculo, dibuja 6 pétalos ovalados distribuidos uniformemente.",
            imageKey: "flower_step2",
          },
          {
            id: 3,
            instruction: "Dibuja un tallo recto hacia abajo desde la flor. Agrega dos hojas ovaladas en el tallo.",
            imageKey: "flower_step3",
          },
          {
            id: 4,
            instruction: "Rellena el centro con puntos pequeños y agrega detalles en cada pétalo con líneas finas. ¡Tu flor está en flor!",
            imageKey: "flower_step4",
          },
        ],
      },
    ],
  },
  {
    id: "objects",
    name: "Objetos",
    emoji: "🎨",
    color: "#9B59B6",
    levels: [
      {
        id: "objects-basic",
        title: "Casa Acogedora",
        difficulty: "Básico",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un cuadrado grande. Esta es la base de tu casa.",
            imageKey: "house_step1",
          },
          {
            id: 2,
            instruction: "Sobre el cuadrado, dibuja un triángulo para el techo. Que sus lados sean del mismo ancho que el cuadrado.",
            imageKey: "house_step2",
          },
          {
            id: 3,
            instruction: "Agrega una puerta rectangular en el centro de la base y una ventana cuadrada a cada lado de la puerta.",
            imageKey: "house_step3",
          },
          {
            id: 4,
            instruction: "Dibuja una chimenea rectangular en el techo y agrega detalles: manija en la puerta, cruces en las ventanas, líneas en el techo.",
            imageKey: "house_step4",
          },
        ],
      },
      {
        id: "objects-intermediate",
        title: "Cohete Espacial",
        difficulty: "Intermedio",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un rectángulo vertical alargado. Este es el cuerpo del cohete.",
            imageKey: "rocket_step1",
          },
          {
            id: 2,
            instruction: "En la parte superior del rectángulo, dibuja un triángulo apuntando hacia arriba. Esta es la punta del cohete.",
            imageKey: "rocket_step2",
          },
          {
            id: 3,
            instruction: "A cada lado de la base del cohete, añade un triángulo pequeño apuntando hacia afuera. Son las aletas.",
            imageKey: "rocket_step3",
          },
          {
            id: 4,
            instruction: "Dibuja un círculo en el centro del cuerpo (ventanilla), llamas saliendo de la base y estrellas alrededor. ¡Al infinito!",
            imageKey: "rocket_step4",
          },
        ],
      },
    ],
  },
  {
    id: "faces",
    name: "Personajes",
    emoji: "😊",
    color: "#F1C40F",
    levels: [
      {
        id: "faces-basic",
        title: "Cara Feliz",
        difficulty: "Básico",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un círculo grande en el centro del papel. Esta será la cara de tu personaje.",
            imageKey: "face_step1",
          },
          {
            id: 2,
            instruction: "Dibuja dos círculos medianos para los ojos. Dentro de cada ojo, un círculo pequeño (pupila) y un punto blanco (brillo).",
            imageKey: "face_step2",
          },
          {
            id: 3,
            instruction: "Dibuja una nariz pequeña en forma de semicírculo en el centro y una boca sonriente curvada hacia arriba.",
            imageKey: "face_step3",
          },
          {
            id: 4,
            instruction: "Añade cabello dibujando líneas o curvas en la parte superior del círculo. Agrega cejas arqueadas para dar expresión. ¡Sonríe!",
            imageKey: "face_step4",
          },
        ],
      },
      {
        id: "faces-intermediate",
        title: "Superhéroe",
        difficulty: "Intermedio",
        stars: 0,
        steps: [
          {
            id: 1,
            instruction: "Dibuja un óvalo para la cabeza y un rectángulo más ancho debajo para los hombros y el pecho del superhéroe.",
            imageKey: "hero_step1",
          },
          {
            id: 2,
            instruction: "Agrega los ojos con una máscara que los rodee (dibuja la máscara como dos óvalos conectados sobre los ojos).",
            imageKey: "hero_step2",
          },
          {
            id: 3,
            instruction: "Dibuja el cabello con puntas hacia arriba y una capa detrás de los hombros cayendo hacia los lados.",
            imageKey: "hero_step3",
          },
          {
            id: 4,
            instruction: "Agrega el símbolo de tu héroe en el pecho (un rayo, una estrella, etc.), los brazos musculosos y el puño cerrado. ¡Al rescate!",
            imageKey: "hero_step4",
          },
        ],
      },
    ],
  },
];

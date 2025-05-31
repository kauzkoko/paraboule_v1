export const includesArray = ["Exhibition", "S1", "S2", "S3"];

export const modesList = [
  {
    name: "All",
    description: "All mode",
  },
  {
    name: "Exhibition",
    description: "Exhibition mode",
  },
  {
    name: "S1",
    description: "S1 mode",
  },
  {
    name: "S2",
    description: "S2 mode",
  },
  {
    name: "S3",
    description: "S3 mode",
  },
];

// {
//   name: "Player 1",
//   description: "Player 1 mode",
// },
// {
//   name: "Player 2",
//   description: "Player 2 mode",
// },
// {
//   name: "Assistant",
//   description: "Assistant mode",
// },
// {
//   name: "Parkplatz",
//   description: "Parkplatz mode",
// },

// export const mockIntersections = [
//   [
//     {
//       x: 0.15217870875827644,
//       y: 0.11757755279540989,
//       z: -2.14242094133827,
//       class: "cochonnet",
//     },
//     {
//       x: 0.3014103032020119,
//       y: 0.11757755279540989,
//       z: -2.3185530158534984,
//       class: "dark",
//     },
//     {
//       x: 0.019827494002689575,
//       y: 0.13757755279540984,
//       z: -1.873205403607142,
//       class: "light",
//     },
//     {
//       x: 0.35239538925638664,
//       y: 0.050841178894042934,
//       z: -2.040454871744344,
//       class: "dark",
//     },
//     {
//       x: 0.20640927469181287,
//       y: 0.10841178894042956,
//       z: -1.9825655394221926,
//       class: "light",
//     },
//   ],
//   [
//     {
//       x: 0.25217870875827644,
//       y: 0.11757755279540989,
//       z: -2.34242094133827,
//       class: "cochonnet",
//     },
//     {
//       x: 0.1014103032020119,
//       y: 0.11757755279540989,
//       z: -2.4185530158534984,
//       class: "dark",
//     },
//     {
//       x: 0.049827494002689575,
//       y: 0.23757755279540984,
//       z: -1.273205403607142,
//       class: "light",
//     },
//     {
//       x: 0.35239538925638664,
//       y: 0.050841178894042934,
//       z: -2.40454871744344,
//       class: "dark",
//     },
//     {
//       x: 0.10640927469181287,
//       y: 0.10841178894042956,
//       z: -1.9825655394221926,
//       class: "light",
//     },
//   ],
// ];

const unscaledBahnMockIntersections = [
  // [
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //     class: "cochonnet",
  //   },
  // ],
  // [
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //     class: "cochonnet",
  //   },
  //   {
  //     x: -119,
  //     y: 340,
  //     z: 0,
  //     class: "dark",
  //   },
  // ],
  [
    {
      x: 0,
      y: 0,
      z: 0,
      class: "cochonnet",
    },
    {
      x: -119,
      y: 340,
      z: 0,
      class: "dark",
    },
    {
      x: -330,
      y: 340,
      z: 0,
      class: "light",
    },
  ],
  [
    {
      x: 0,
      y: 0,
      z: 0,
      class: "cochonnet",
    },
    {
      x: -119,
      y: 340,
      z: 0,
      class: "dark",
    },
    {
      x: -330,
      y: 340,
      z: 0,
      class: "light",
    },
    {
      x: 291,
      y: 205,
      z: 0,
      class: "dark",
    },
  ],
  [
    {
      x: 0,
      y: 0,
      z: 0,
      class: "cochonnet",
    },
    {
      x: -119,
      y: 340,
      z: 0,
      class: "dark",
    },
    {
      x: -330,
      y: 340,
      z: 0,
      class: "light",
    },
    {
      x: 1294,
      y: 521,
      z: 0,
      class: "light",
    },
    {
      x: 357,
      y: 1649,
      z: 0,
      class: "dark",
    },
  ],
  [
    {
      x: 0,
      y: 0,
      z: 0,
      class: "cochonnet",
    },
    {
      x: -223,
      y: 164,
      z: 0,
      class: "dark",
    },
    {
      x: -9,
      y: 164,
      z: 0,
      class: "light",
    },
    {
      x: 1294,
      y: 521,
      z: 0,
      class: "light",
    },
    {
      x: 357,
      y: 1649,
      z: 0,
      class: "dark",
    },
    {
      x: 235,
      y: 408,
      z: 0,
      class: "dark",
    },
  ],
  [
    {
      x: 0,
      y: 0,
      z: 0,
      class: "cochonnet",
    },
    {
      x: -223,
      y: 164,
      z: 0,
      class: "dark",
    },
    {
      x: 63,
      y: 366,
      z: 0,
      class: "light",
    },
    {
      x: 1294,
      y: 521,
      z: 0,
      class: "light",
    },
    {
      x: 357,
      y: 1649,
      z: 0,
      class: "dark",
    },
    {
      x: 235,
      y: 408,
      z: 0,
      class: "dark",
    },
    {
      x: -321,
      y: 1239,
      z: 0,
      class: "light",
    },
  ],
];

export const mockIntersections = unscaledBahnMockIntersections.map((intersection) => {
  return intersection.map((point) => {
    return {
      ...point,
      x: point.x / 1600,
      z: point.y / -1600,
      y: point.z / 0,
    };
  });
});


export const soundSrcs = [
  "/sounds/raman1.mp3",
  "/sounds/raman2.mp3",
];

export const yoloModels = [
  {
    name: "bolobolo",
    id: "24",
    modelId: "rf_li9xBZWuL5cSB9B343OFn9GGqpF2",
  },
];
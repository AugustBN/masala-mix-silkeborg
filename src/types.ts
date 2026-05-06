/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function spiceLabel(level: string): string {
  const map: Record<string, string> = { mild: 'Mild', medium: 'Medium', hot: 'Stærk' };
  return map[level] ?? level;
}

export interface Addon {
  name: string;
  price: number;
}

export interface Dish {
  name: string;
  price: number;
  description: string;
  addons: Addon[];
}

export interface CartItem {
  cartId: string;
  dish: Dish;
  spiceLevel: string;
  selectedAddons: Addon[];
  totalPrice: number;
  quantity: number;
}

export interface CompletedOrder {
  orderId: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    time: string;
    notes?: string;
  };
  timestamp: string;
}

export const MENU_DATA: { category: string; dishes: Dish[] }[] = [
  {
    category: "Indiske Hovedretter",
    dishes: [
      {
        name: 'Butter Chicken',
        price: 129,
        description: 'Tandoori grillet kylling tilberedt i en mild og cremet tomatsovs med smør og cashewnødder.',
        addons: [
          { name: 'Ekstra kylling', price: 30 },
          { name: 'Ekstra ris', price: 20 },
          { name: 'Ekstra Naan', price: 25 }
        ]
      },
      {
        name: 'Chicken Tikka Masala',
        price: 129,
        description: 'Grillet kylling i stykker i en lækker krydret masala sovs med friske peberfrugter og løg.',
        addons: [
          { name: 'Ekstra kylling', price: 30 },
          { name: 'Ekstra ris', price: 20 }
        ]
      },
      {
        name: 'Chicken Korma',
        price: 129,
        description: 'En mild og eksotisk ret med kylling tilberedt i en cremet sovs af kokosmælk, mandler og cashewnødder.',
        addons: [
          { name: 'Ekstra kylling', price: 30 },
          { name: 'Ekstra ris', price: 20 }
        ]
      },
      {
        name: 'Lamb Rogan Josh',
        price: 139,
        description: 'En klassisk nordindisk lammecurry med masser af smag fra aromatiske krydderier.',
        addons: [
          { name: 'Ekstra lammekød', price: 35 },
          { name: 'Ekstra ris', price: 20 }
        ]
      },
      {
        name: 'Lamb Curry',
        price: 139,
        description: 'Mørt lammekød langtidssimret i en traditionel, fyldig nordindisk karrysovs.',
        addons: [
          { name: 'Ekstra lammekød', price: 35 },
          { name: 'Ekstra ris', price: 20 }
        ]
      }
    ]
  },
  {
    category: "Vegetariske Retter",
    dishes: [
      {
        name: 'Paneer Butter Masala',
        price: 119,
        description: 'Hjemmelavet indisk ost (paneer) tilberedt i en rig og cremet tomatsovs.',
        addons: [
          { name: 'Ekstra ris', price: 20 },
          { name: 'Ekstra Naan', price: 25 }
        ]
      },
      {
        name: 'Chana Masala',
        price: 109,
        description: 'Kikærter tilberedt i en krydret og lækker masala-sovs med friske krydderier.',
        addons: [
          { name: 'Ekstra ris', price: 20 }
        ]
      },
      {
        name: 'Dal Makhani',
        price: 109,
        description: 'Sorte linser og nyrebønner simret natten over og afsluttet med fløde og smør.',
        addons: [
          { name: 'Ekstra ris', price: 20 }
        ]
      }
    ]
  },
  {
    category: "Biryani",
    dishes: [
      {
        name: 'Chicken Biryani',
        price: 139,
        description: 'Aromatiske basmati ris dampet med krydret kylling og masser af indiske krydderier. Serveres med raita.',
        addons: []
      },
      {
        name: 'Lamb Biryani',
        price: 149,
        description: 'Festlig risret med mørt lammekød, safran og blandede krydderier. Serveres med raita.',
        addons: []
      }
    ]
  },
  {
    category: "Tilbehør",
    dishes: [
      {
        name: 'Vegansk Samosa (2 stk)',
        price: 45,
        description: 'Sprøde trekanter fyldt med krydrede kartofler og ærter.',
        addons: []
      },
      {
        name: 'Naan Brød',
        price: 25,
        description: 'Klassisk indisk hvedebrød bagt i tandoor-ovn.',
        addons: []
      },
      {
        name: 'Hvidløgs Naan',
        price: 30,
        description: 'Hvedebrød bagt med frisk hvidløg og koriander.',
        addons: []
      },
      {
        name: 'Ekstra Ris',
        price: 20,
        description: 'Dampede basmati ris.',
        addons: []
      },
      {
        name: 'Raita',
        price: 25,
        description: 'Krydret yoghurtdressing med agurk og lette krydderier.',
        addons: []
      }
    ]
  },
  {
    category: "Drikkevarer",
    dishes: [
      {
        name: 'Mango Lassi',
        price: 35,
        description: 'Forfriskende indisk yoghurtdrik med mango smag.',
        addons: []
      },
      {
        name: 'Sodavand 0.5L',
        price: 25,
        description: 'Vælg mellem Coca Cola, Zero, Fanta eller Sprite.',
        addons: []
      },
      {
        name: 'Sodavand 1.5L',
        price: 45,
        description: 'Vælg mellem Coca Cola, Zero, Fanta eller Sprite.',
        addons: []
      },
      {
        name: 'Kildevand',
        price: 20,
        description: 'Naturligt mineralvand på flaske.',
        addons: []
      }
    ]
  }
];

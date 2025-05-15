"use client"

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';

// Define the CartItem type if not already imported
// Define the Pizza type if not already imported
type Pizza = {
  id: string;
  name: string;
  image?: string;
  // add other pizza properties if needed
};


export interface CartItem {
  pizza: Pizza;
  quantity: number;
  specialInstructions?: string;
}


export default function CartItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.pizza.image || '/placeholder.svg'}
          alt={item.pizza.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.pizza.name}</h3>
          <p className="font-medium">{/* FormatPrice ici */}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => removeItem(item.pizza.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
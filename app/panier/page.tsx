"use client"

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import CartItem from '@/context/cart-item'; // Vous devrez créer ce composant

export default function CartDrawer() {
  const { items, totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Effet pour gérer l'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ouvrir/fermer le panier
  const toggleCart = () => setIsOpen(!isOpen);

  // Animation de fond
  const overlayClasses = cn(
    'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  );

  // Animation du panier
  const drawerClasses = cn(
    'fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out',
    isOpen ? 'translate-x-0' : 'translate-x-full'
  );

  // Empêcher le défilement lorsque le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      {/* Bouton du panier avec badge */}
      <button 
        onClick={toggleCart}
        className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-4 shadow-lg z-30 hover:bg-primary/90 transition-colors"
        aria-label="Ouvrir le panier"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className={overlayClasses}
          onClick={toggleCart}
          aria-hidden="true"
        />
      )}

      {/* Panier latéral */}
      <div className={drawerClasses}>
        <div className="h-full flex flex-col">
          {/* En-tête */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Votre Panier ({totalItems})</h2>
            <button 
              onClick={toggleCart}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Fermer le panier"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.pizza.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Pied de page */}
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">{/* Insérez le total ici */}</span>
              </div>
              <Button className="w-full" size="lg">
                Passer la commande
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
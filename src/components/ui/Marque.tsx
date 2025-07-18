"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const InfiniteMovingProducts = ({
  products,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
  height = "h-[60vh]",
}: {
  products: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  height?: string; // allow adjustable height
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      setDirection();
      setSpeed();
      setStart(true);
    }
  }, []);

  const setDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const setSpeed = () => {
    if (containerRef.current) {
      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative z-20 max-w-full overflow-hidden", className)}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {products.map((product) => (
          <li
            key={product.id + Math.random()}
            className="flex-shrink-0 w-64 mx-3 cursor-pointer h-full"
          >
            <Link href={`/shop/details/${product.id}`} passHref>
              <div className="flex flex-col h-full overflow-hidden bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl">
                <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-primary/5">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 p-4 text-center">
                  <h3 className="font-serif font-bold text-lg text-foreground mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-primary font-bold text-xl">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

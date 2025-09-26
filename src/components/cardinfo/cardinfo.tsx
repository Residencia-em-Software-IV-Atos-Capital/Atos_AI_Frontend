// src/components/CardInfo.tsx
import React from "react";
import "../../styles/cards.css";

interface CardInfoProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changePercent?: number; // ex: 12.5 (positivo) ou -3.2 (negativo)
}

export default function CardInfo({
  title,
  value,
  subtitle,
  changePercent,
}: CardInfoProps) {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <div className="card-info">
      <div className="card-top">
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>

      <div className="card-middle">
        <div className="card-value">{value}</div>
        {typeof changePercent === "number" && (
          <div className={`card-change ${isPositive ? "up" : "down"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

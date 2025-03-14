'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetTime = new Date(now);
      targetTime.setUTCHours(1, 0, 0, 0); // 1 AM GMT

      // If it's past 1 AM GMT, set target to next day
      if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const difference = targetTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="bg-primary-gold bg-opacity-10 p-4 rounded-lg border border-primary-gold border-opacity-50 text-center">
        <p className="text-primary-brown font-['Amiri'] text-lg">
          Winner announcement in progress!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-sand-light p-4 rounded-lg border border-primary-gold border-opacity-50">
      <div className="flex items-center justify-center mb-2">
        <Clock className="text-primary-gold mr-2" />
        <h3 className="text-primary-brown font-['Amiri'] text-lg">
          Next Winner Announcement In
        </h3>
      </div>
      
      <div className="flex justify-center items-center space-x-4">
        <div className="text-center">
          <div className="bg-primary-gold bg-opacity-10 px-3 py-2 rounded-md">
            <span className="text-2xl font-bold text-primary-brown">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-primary-brown mt-1 block">Hours</span>
        </div>

        <span className="text-primary-gold text-2xl">:</span>

        <div className="text-center">
          <div className="bg-primary-gold bg-opacity-10 px-3 py-2 rounded-md">
            <span className="text-2xl font-bold text-primary-brown">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-primary-brown mt-1 block">Minutes</span>
        </div>

        <span className="text-primary-gold text-2xl">:</span>

        <div className="text-center">
          <div className="bg-primary-gold bg-opacity-10 px-3 py-2 rounded-md">
            <span className="text-2xl font-bold text-primary-brown">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-primary-brown mt-1 block">Seconds</span>
        </div>
      </div>
    </div>
  );
}
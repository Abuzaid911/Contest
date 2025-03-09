'use client';

import { useState, useEffect, useRef } from 'react';
import { Share2, Check, Copy, Facebook, Twitter, WhatsApp, Mail } from 'lucide-react';

interface ShareAppButtonProps {
  className?: string;
  showText?: boolean;
  position?: 'header' | 'floating';
}

export default function ShareAppButton({ 
  className = '', 
  showText = true,
  position = 'header'
}: ShareAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: true, right: true });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const appTitle = "Ramadan Iftar Contest";
  const appDescription = "Join our Ramadan community by sharing your Iftar meals and discovering dishes from others!";
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const shareData = {
    title: appTitle,
    text: appDescription,
    url: appUrl
  };

  // Calculate menu position based on button position
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      // Get button position
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      
      // Check if menu would go off-screen to the right
      const rightOverflow = buttonRect.right + menuRect.width > window.innerWidth;
      // Check if menu would go off-screen at the bottom
      const bottomOverflow = buttonRect.bottom + menuRect.height > window.innerHeight;
      
      setMenuPosition({
        right: !rightOverflow,
        top: !bottomOverflow
      });
    }
  }, [isOpen]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current && 
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleShare = async () => {
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyLink = () => {
    const textToCopy = `${appTitle}: ${appUrl}\n${appDescription}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(appDescription)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={16} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(appDescription)}&url=${encodeURIComponent(appUrl)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp size={16} />,
      url: `https://wa.me/?text=${encodeURIComponent(`${appTitle}: ${appUrl}\n${appDescription}`)}`,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Email',
      icon: <Mail size={16} />,
      url: `mailto:?subject=${encodeURIComponent(appTitle)}&body=${encodeURIComponent(`${appDescription}\n\n${appUrl}`)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className={`relative ${position === 'floating' ? 'h-12 w-12' : ''}`}>
      <button 
        ref={buttonRef}
        onClick={handleShare}
        className={`flex items-center justify-center bg-primary-gold hover:bg-secondary-gold text-white transition-all ${
          position === 'floating' 
            ? 'h-12 w-12 rounded-full shadow-lg' 
            : 'px-4 py-2 rounded-md'
        } ${className}`}
        aria-label="Share app"
      >
        <Share2 size={18} className={showText ? "mr-2" : ""} />
        {showText && <span>Share App</span>}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40 sm:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          ></div>
          <div 
            ref={menuRef}
            className={`absolute ${
              menuPosition.top ? 'top-full' : 'bottom-full'
            } ${
              menuPosition.right ? 'right-0' : 'left-0'
            } mt-2 mb-2 w-64 bg-cream rounded-md shadow-lg z-50 border border-primary-gold overflow-hidden`}
            style={{
              maxWidth: 'calc(100vw - 20px)'
            }}
          >
            <div className="p-3 border-b border-primary-gold border-opacity-30">
              <h3 className="text-primary-brown font-medium">Share Ramadan Iftar Contest</h3>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center text-white text-sm px-3 py-2 rounded-md transition-colors ${link.color}`}
                    onClick={() => {
                      // Close menu after a short delay to allow link to open
                      setTimeout(closeMenu, 100);
                    }}
                  >
                    {link.icon}
                    <span className="ml-1">{link.name}</span>
                  </a>
                ))}
              </div>
              
              <button
                className="w-full flex items-center justify-center bg-primary-gold bg-opacity-10 hover:bg-opacity-20 text-primary-brown px-3 py-2 rounded-md transition-colors text-sm"
                onClick={copyLink}
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1.5" />
                    <span>Link copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1.5" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
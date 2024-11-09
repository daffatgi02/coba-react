import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [dragging, setDragging] = useState({
    isDragging: false,
    startX: 0,
    scrollLeft: 0
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!dragging.isDragging) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 7000);
    return () => clearInterval(slideInterval);
  }, [images.length, dragging.isDragging]);

  const handleDragStart = (e) => {
    const startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
    setDragging({ isDragging: true, startX, scrollLeft: currentIndex });
  };

  const handleDragMove = (e) => {
    if (!dragging.isDragging) return;
    e.preventDefault();
    const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
    const walk = (dragging.startX - x) * 1.5;

    if (Math.abs(walk) > 50) {
      if (walk > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setDragging((prev) => ({ ...prev, isDragging: false }));
      } else if (walk < 0) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setDragging((prev) => ({ ...prev, isDragging: false }));
      }
    }
  };

  const handleDragEnd = () => setDragging((prev) => ({ ...prev, isDragging: false }));

  const handleZoom = (imageUrl) => setZoomedImage(imageUrl);
  const closeZoom = () => setZoomedImage(null);

  const getImageStyles = useCallback(
    (index) => {
      const isActive = index === currentIndex;
      const isPrev = index === (currentIndex - 1 + images.length) % images.length;
      const isNext = index === (currentIndex + 1) % images.length;

      let position = '';
      let scale = '2';
      let opacity = '0';
      let zIndex = 0;

      if (isActive) {
        scale = '0.9';
        opacity = '1';
        zIndex = 50;
        position = '0';
      } else if (isPrev || isNext) {
        scale = '0.6';
        opacity = '0.5';
        zIndex = 40;
        position = isPrev ? '-50%' : '50%';
      }

      return { transform: `translateX(${position}) scale(${scale})`, opacity, zIndex };
    },
    [currentIndex, images.length]
  );

  return (
    <>
      <div className="relative w-full max-w-3xl mx-auto h-[40vh] mb-8">
        <div
          ref={containerRef}
          className="overflow-visible w-full h-full flex justify-center items-center select-none"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="relative w-full h-full flex justify-center items-center">
            {images.map((image, index) => {
              const imageStyles = getImageStyles(index);
              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ease-in-out cursor-grab ${
                    dragging.isDragging ? 'cursor-grabbing' : ''
                  } rounded-2xl overflow-hidden`}
                  style={{
                    ...imageStyles,
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={() => imageStyles.opacity === '1' && !dragging.isDragging && handleZoom(image)}
                >
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                    draggable="false"
                    loading="lazy"  // Lazy loading image
                  />
                </div>
              );
            })}
          </div>
        </div>


      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000]"
          onClick={closeZoom}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={closeZoom}
              className="absolute -top-4 -right-4 bg-white rounded-full p-1 hover:bg-gray-200 transition-colors"
            >
              <X size={24} className="text-black" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;

import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Image generation
export default function Icon() {
  // Check if we're in development/localhost
  const isDev = process.env.NODE_ENV === 'development' || 
                process.env.VERCEL_ENV === 'development' ||
                !process.env.VERCEL; // localhost

  // Different colors for dev vs production
  // Red background with "L" for localhost, Green background with "P" for production
  const backgroundColor = isDev ? '#ef4444' : '#008060';
  const textColor = '#ffffff';
  const letter = isDev ? 'L' : 'P';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor,
          fontSize: 22,
          fontWeight: 'bold',
          color: textColor,
          fontFamily: 'system-ui',
        }}
      >
        {letter}
      </div>
    ),
    {
      ...size,
    }
  );
}


import { useQRCode } from "next-qrcode"

interface CustomQRProps {
  value: string
  size: number
  style: {
    fgColor: string
    bgColor: string
    cornerRadius: number
    dotScale: number
  }
  logoUrl?: string
}

export default function CustomQR({ value, size, style, logoUrl }: CustomQRProps) {
  const { Canvas } = useQRCode()

  return (
    <Canvas
      text={value}
      options={{
        width: size,
        height: size,
        type: "image/png",
        quality: 1,
        margin: 10,
        scale: 4,
        errorCorrectionLevel: "H",
        color: {
          dark: style.fgColor,
          light: style.bgColor,
        },
        // QR Code styling
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0,
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          type: "dots",
          color: style.fgColor,
          gradient: undefined,
          rotation: 0,
          scale: style.dotScale,
        },
        backgroundOptions: {
          color: style.bgColor,
          gradient: undefined,
        },
        cornersSquareOptions: {
          type: style.cornerRadius > 0 ? "extra-rounded" : "square",
          color: style.fgColor,
          gradient: undefined,
          scale: 1,
        },
        cornersDotOptions: {
          type: style.cornerRadius > 0 ? "dot" : "square",
          color: style.fgColor,
          gradient: undefined,
          scale: 1,
        },
      }}
      logo={{
        src: logoUrl,
        options: {
          width: size * 0.23,
          x: undefined,
          y: undefined,
        },
      }}
    />
  )
}


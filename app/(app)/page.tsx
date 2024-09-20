"use client"

import Preview from "@/components/Preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'

import messages from '@/messages.json';
import { Mail } from "lucide-react";
import { Suspense } from "react";

const Home = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-12 bg-gray-800 text-white">
  {/* Section with Title and Subtitle */}
  <section className="flex flex-col gap-4 items-center justify-center text-center px-4">
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
      Welcome to the World of Anonymous Feedback
    </h1>
    <p className="text-md sm:text-lg md:text-xl lg:text-2xl font-medium">
      True Feedback - Where your identity remains a secret
    </p>
  </section>

  {/* Carousel for messages */}
  <Carousel plugins={[Autoplay({delay: 2500})]}
  opts={{
    align: "start",
    loop: true,
  }}
  className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mt-8 scroll-smooth">
    <CarouselContent>
      {messages.map((message, index) => (
        <CarouselItem key={index}>
          <div className="p-4">
            <Suspense fallback={<Preview />} >

            <Card className="text-balance">
              <CardHeader className="w-full flex justify-center">
                <CardTitle>{message.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                <Mail className="flex-shrink-0" />
                <div>
                  <p>{message.content}</p>
                  <p className="text-xs text-muted-foreground">{message.received}</p>
                </div>
              </CardContent>
            </Card>

            </Suspense>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="text-black" />
    <CarouselNext className="text-black" />
  </Carousel>
</main>

  )
}

export default Home

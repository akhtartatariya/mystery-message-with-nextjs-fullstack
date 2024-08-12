"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/data/message.json"
import Autoplay from 'embla-carousel-autoplay'
const Home = () => {
  //  const autoplay = Autoplay()
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white h-[87.3vh] w-full">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message,index)=>(
              <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>
                    {message.title}
                  </CardHeader>
                  <CardContent className="">
                    <span className="text-2xl font-semibold">{message.content}</span>
                  </CardContent>
                  <CardFooter>
                    {message.received}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
            ))
          }
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </main>
  )
}

export default Home

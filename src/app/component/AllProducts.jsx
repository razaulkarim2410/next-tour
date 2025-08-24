import dbConnect from '@/lib/dbConnect'
import Image from 'next/image'
import React from 'react'

export default async function AllProducts() {
//    const data = [
//   {
//     "product_id": 1,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Wireless Bluetooth Headphones",
//     "price": 79.99,
//     "description": "Crystal clear sound with deep bass.\nComfortable over-ear design for long use.\nUp to 30 hours of battery life.\nNoise-canceling technology included.\nPerfect for travel, work, or gym sessions.\nLightweight foldable design for portability.\nBuilt-in microphone for calls and meetings.\nSupports both wired and wireless connections.",
//     "rating": 4.6,
//     "category": "Electronics",
//     "brand": "SoundMax",
//     "stock": 45
//   },
//   {
//     "product_id": 2,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Smart Fitness Watch",
//     "price": 59.99,
//     "description": "Tracks heart rate, steps, and calories.\nWater-resistant up to 50 meters.\nSleep monitoring and stress tracking.\nBright AMOLED touch display.\nCompatible with Android and iOS devices.\nCustomizable watch faces and themes.\nLong battery life up to 7 days.\nInstant notifications for calls and messages.",
//     "rating": 4.3,
//     "category": "Wearables",
//     "brand": "FitTech",
//     "stock": 62
//   },
//   {
//     "product_id": 3,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Gaming Mechanical Keyboard",
//     "price": 109.99,
//     "description": "RGB backlit keys with 18 modes.\nBlue switches for tactile feedback.\nDurable metal frame with wrist rest.\nAnti-ghosting and programmable macros.\nPerfect for professional gaming setups.\nCompact layout with detachable cable.\nSupports custom key mapping software.\nBuilt to last with 50 million keystroke switches.",
//     "rating": 4.8,
//     "category": "Gaming",
//     "brand": "ProKey",
//     "stock": 25
//   },
//   {
//     "product_id": 4,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "4K Ultra HD Smart TV",
//     "price": 499.99,
//     "description": "Stunning 4K resolution with HDR10.\nBuilt-in streaming apps like Netflix & Prime.\nSlim bezels and modern design.\nDolby Audio for immersive sound.\nMultiple HDMI and USB ports for connectivity.\nVoice control with smart assistants.\nEnergy-efficient with auto-brightness control.\nWall-mountable with sleek thin profile.",
//     "rating": 4.7,
//     "category": "Electronics",
//     "brand": "VisionX",
//     "stock": 12
//   },
//   {
//     "product_id": 5,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Ergonomic Office Chair",
//     "price": 189.99,
//     "description": "Adjustable height, tilt, and armrests.\nBreathable mesh back for comfort.\nLumbar support reduces back strain.\nSturdy wheels for smooth movement.\nIdeal for home and office workstations.\n360-degree swivel for flexibility.\nHigh weight capacity for durability.\nEasy to assemble with step-by-step guide.",
//     "rating": 4.5,
//     "category": "Furniture",
//     "brand": "ComfyWork",
//     "stock": 38
//   },
//   {
//     "product_id": 6,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Portable Power Bank 20000mAh",
//     "price": 39.99,
//     "description": "Charges devices multiple times.\nDual USB output with fast charging.\nSlim, lightweight, and travel-friendly.\nLED indicator for battery level.\nSafe with overcharge protection technology.\nUniversal compatibility with all phones.\nPass-through charging supported.\nDurable design with scratch resistance.",
//     "rating": 4.4,
//     "category": "Accessories",
//     "brand": "ChargeUp",
//     "stock": 75
//   },
//   {
//     "product_id": 7,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Professional DSLR Camera",
//     "price": 899.99,
//     "description": "24MP sensor with 4K video recording.\nInterchangeable lenses for versatility.\nWi-Fi and Bluetooth connectivity.\nDurable body with weather sealing.\nIdeal for beginners and professionals.\nFast autofocus with subject tracking.\nSupports RAW image format.\nLong-lasting battery with quick charging.",
//     "rating": 4.9,
//     "category": "Cameras",
//     "brand": "PhotoMaster",
//     "stock": 10
//   },
//   {
//     "product_id": 8,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Smart Home Speaker",
//     "price": 129.99,
//     "description": "Voice assistant with AI integration.\n360-degree surround sound.\nCompact design with premium finish.\nMulti-room audio control supported.\nWorks with smart home devices.\nSeamless streaming via Wi-Fi and Bluetooth.\nTouch controls with LED indicators.\nPrivacy mode with microphone mute option.",
//     "rating": 4.2,
//     "category": "Smart Home",
//     "brand": "HomeSound",
//     "stock": 53
//   },
//   {
//     "product_id": 9,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Electric Standing Desk",
//     "price": 299.99,
//     "description": "Height adjustable with memory presets.\nSpacious tabletop for dual monitors.\nSturdy steel frame with smooth motor.\nReduces fatigue and improves posture.\nPerfect for home and office use.\nLow-noise operation for focus.\nScratch-resistant tabletop finish.\nSmart cable management system included.",
//     "rating": 4.6,
//     "category": "Furniture",
//     "brand": "FlexiDesk",
//     "stock": 20
//   },
//   {
//     "product_id": 10,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Noise-Canceling Earbuds",
//     "price": 99.99,
//     "description": "Compact design with ergonomic fit.\nActive noise cancellation feature.\nUp to 24 hours of playback time.\nWireless charging case included.\nPerfect for calls, music, and workouts.\nSweat and water-resistant build.\nQuick charge support with 10min = 2hr play.\nTouch controls for music and calls.",
//     "rating": 4.3,
//     "category": "Electronics",
//     "brand": "ClearTune",
//     "stock": 47
//   },
//   {
//     "product_id": 11,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Laptop Backpack with USB Port",
//     "price": 49.99,
//     "description": "Water-resistant and durable material.\nSpacious compartments for 15-inch laptop.\nBuilt-in USB charging port.\nAnti-theft hidden zipper design.\nLightweight and comfortable to carry.\nPadded shoulder straps for support.\nMultiple organizers for gadgets.\nStylish modern design for daily use.",
//     "rating": 4.5,
//     "category": "Bags",
//     "brand": "UrbanGear",
//     "stock": 68
//   },
//   {
//     "product_id": 12,
//     "image": "https://i.ibb.co/CpVYg1BM/pexels-mikhail-nilov-27914809.jpg",
//     "title": "Air Fryer with Digital Display",
//     "price": 139.99,
//     "description": "Healthier frying with less oil.\nLarge 5L capacity for family meals.\nTouchscreen digital controls.\nMultiple preset cooking functions.\nEasy to clean and dishwasher safe basket.\nFast cooking with hot air circulation.\nCompact design saves kitchen space.\nEnergy-efficient and safe to use.",
//     "rating": 4.7,
//     "category": "Kitchen",
//     "brand": "CookEase",
//     "stock": 34
//   }
// ]
const serviceCollection = dbConnect("products")
const data = await serviceCollection.find({}).toArray()
  return (
 <div className='grid grid-cols-12 w-10/12 mx-auto my-10 gap-3'>
  {data.map((item)=> {
    return(
      <div className='col-span-12 md:col-span-4 lg:col-span-3 p-4 h-full border gap-3 ' key={item.product_id}> 
      <Image className='' src={item.image} width={250} height={300} alt={item.title}/>
      <div className='flex justify-between items-center mt-4'>
        <div>
          <h2 className='font-bold text-xl'>{item.title}</h2>
          <p className='font-bold text-xl text-orange-500'>Price: ${item.price}</p>
        </div>

      </div>
      </div>
    )
  })}
 </div>
  
  )
   
}

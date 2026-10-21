import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin, CustomEase, useGSAP)
gsap.defaults({ ease: 'expo.out', duration: 1.1 })
// mobile browser chrome showing/hiding must not trigger a full refresh (prevents scroll jumps)
ScrollTrigger.config({ ignoreMobileResize: true })
CustomEase.create('silk', '0.7, 0, 0.15, 1')

// Delay applied to page-hero intros so they play after the route transition uncovers the page.
export const intro = { delay: 0 }

export const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, SplitText, useGSAP }

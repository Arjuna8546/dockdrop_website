// Single place where GSAP plugins and custom eases are registered (§2).
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(useGSAP, ScrollTrigger, Observer, ScrollToPlugin, DrawSVGPlugin, CustomEase);

// §5.5 landing ease
CustomEase.create('settle', 'M0,0 C0.2,0 0.2,1.15 0.45,1.05 0.7,0.97 0.85,1 1,1');

/** §5.5 stage transition duration, in seconds */
export const DUR = { transition: 0.9 };

export { gsap, useGSAP, ScrollTrigger, Observer };

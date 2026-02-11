"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AmongUsGame.module.css";

// --- Asset Assembler Helper ---
// Sprite Templates from the original CSS (extracted for dynamic coloring)
const SPRITE_IDLE_TEMPLATE = `data:image/svg+xml,%3Csvg width='85' height='120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='42.5' cy='113.5' rx='34.5' ry='6.5' fill='%23000' fill-opacity='.7' /%3E%3Cpath d='M14.5 50H22l-.5 44.5H16c-7.2 0-9-10.6-9-16v-19c0-8.8 5-9.5 7.5-9.5z' fill='BASE_COLOR' /%3E%3Cpath d='M17 57.5c3.5.5 3 1.5 3 1.5l1.5 35.5H16c-7.2 0-9-10.6-9-16v-11c0-8.8 6.5-10.5 10-10z' fill='SHADOW_COLOR' /%3E%3Cpath d='M14.5 50H22l-.5 44.5H16c-7.2 0-9-10.6-9-16v-19c0-8.8 5-9.5 7.5-9.5z' stroke='%23000' stroke-width='5' stroke-linecap='square' /%3E%3Cpath d='M41.5 104c0-8 .5-8.5 5-8.5H52c-1.8 5.4-3 16 6.5 15.5 12-.5 11-13.8 12.5-26 5.5-44.5-7.5-53.8-14.5-58-7-4.2-12.6-5.3-23-2.5-8.2 2.2-11.3 15.3-12.2 25.5-.3 2.8-.3 5.4-.3 7.5V100c0 14.5 2 14.5 11 14.5 7.2 0 9.3-7 9.5-10.5z' fill='BASE_COLOR' /%3E%3Cpath d='M46.5 95.5c-4.5 0-5 .5-5 8.5-.2 3.5-2.3 10.5-9.5 10.5-9 0-11 0-11-14.5V57.5c0-2 0-4.7.3-7.5.6-6.5 2-12.7 4.7-17.5 3.4-6-10.5 49 24 53 20.1 1.1 21.6-24.4 21.7-28.6 0-.8 0-.7 0 0l.2 4c.5 8.8 0 17.5-.9 24.1-1.5 12.2-.5 25.5-12.5 26-9.6.4-8.3-10.1-6.5-15.5h-5.5z' fill='SHADOW_COLOR' /%3E%3Cpath d='M46.5 25.2c-3.2-.4-6.8 0-11.9 1.3-2.9.7-5.3 3.6-7.1 8.2A55.4 55.4 0 0024 57v42.5c0 3.6.1 6.2.4 8 .3 1.9.7 2.7 1 3 .4.4.8.7 2 .8 1.2.2 2.8.2 5.1.2a6 6 0 005.3-2.8c1.1-1.7 1.6-3.8 1.7-5.2 0-2 0-3.6.2-5 0-1.2.3-2.4 1-3.5a4.8 4.8 0 013-2.2c1-.2 2.2-.3 3.3-.3h12.5s-3 1-4 2c-2 2-2 3-2 4.6 0 1.5 0 3.3.4 5.4.3 1.2.7 2 1.4 2.6.6.6 1.7 1 3.6 1 2.5-.2 4-.9 5.2-2 1.2-1 2-2.7 2.7-4.9a45 45 0 001.3-7.8l.3-3.3.6-5.9c2.7-22 .8-35-2.4-42.8a24.2 24.2 0 00-10.9-12.7c-3.3-2-6.1-3.2-9.2-3.5zm2.7 72.3c-.5 2.5-.7 5.4-.2 8 .4 2 1.3 4 3 5.5a10 10 0 007.1 2c3.5-.1 6.3-1.2 8.4-3.2 2-2 3.3-4.5 4-7.2a49.7 49.7 0 002-12.2c0-1.9.3-3.7.5-5.5 2.8-22.5 1-36.4-2.7-45.4a29.2 29.2 0 00-13-15.1A28.1 28.1 0 0047 20.2c-4-.5-8.4 0-13.7 1.4-5.3 1.4-8.6 6.2-10.6 11.2A60.3 60.3 0 0019 57.1v42.4c0 3.7.1 6.6.5 8.8.3 2.3 1 4.2 2.3 5.6 1.3 1.5 3 2.1 4.8 2.4 1.6.2 3.6.2 5.7.2h.2a11 11 0 009.5-5c1.7-2.7 2.4-5.8 2.5-7.8v-.2a48.5 48.5 0 01.4-5.8c.4-.1 1-.2 2.1-.2h2.2z' fill-rule='evenodd' clip-rule='evenodd' fill='%23000' /%3E%3Cpath d='M37.5 42c2.5-5 12-5.5 16.5-5.5s12.2.7 16 4c3.8 3.4 9.5 11.4 1.5 17s-20.3 5-25.5 4C36.5 60 35 47 37.5 42z' fill='%237BD9FA' /%3E%3Cpath d='M37.5 42c5.5-8 3.2-.5 6 4.5 5 9 28 8 29.5 1.5 3.8 3.3 6.5 4-1.5 9.5-8 5.6-20.3 5-25.5 4C36.5 60 35 47 37.5 42z' fill='%23235586' /%3E%3Cpath d='M62 41.5c-4.8-1.2-10-1-10 1.5s2 2 9 3.5c5.6 1.2 7-.5 7-1.5 0-.6-1.2-2.3-6-3.5z' fill='%23fff' /%3E%3Cpath d='M37.5 42c2.5-5 12-5.5 16.5-5.5s12.2.7 16 4c3.8 3.4 9.5 11.4 1.5 17s-20.3 5-25.5 4C36.5 60 35 47 37.5 42z' stroke='%23000' stroke-width='5' stroke-linecap='square' /%3E%3C/svg%3E`;

const SPRITE_WALKING_TEMPLATE = `data:image/svg+xml,%3Csvg width='1020' height='120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cellipse cx='42.5' cy='113.5' rx='34.5' ry='6.5' fill='%23000' fill-opacity='.7'/%3E%3Cpath d='M12.5 36.9l8 1.5v22l1 18h-14L5 72.9v-24l2.5-8.5 5-3.5z' fill='BASE_COLOR'/%3E%3Cpath d='M21.5 48.4s-10-7-15 0c0 11 .3 32.5 1.5 30.5s9.5-.9 13.5 0V48.4z' fill='SHADOW_COLOR'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.5 35.6c4-2.4 8.6-1.7 11.4-.6l1.4.6.2 1.5a343.9 343.9 0 012 38.6 639 639 0 010 4.3v.3H22h2.5v3l-3-.5a133.9 133.9 0 00-14.4-2L5 81l-.4-2.1c-.3-2.2-1-10.5-1.5-26.9-.2-8.6 2.3-13.9 6.5-16.3zm10 41.8a664.2 664.2 0 00-1.8-38.2c-1.9-.4-4-.4-5.7.7C10 41 7.8 44 8 51.8c.3 12.9.9 20.6 1.2 24.1a91 91 0 0110.3 1.5z' fill='%23000'/%3E%3Cpath d='M6.5 83.5c2-9.6 10.8-6.6 15-4V38L24 26.5l9.5-10c5.8-2 19.2-4.3 26 2.5 6.8 6.8 8.2 26.9 8 36L64 75l2.5 2.5L76 81l3 7.5-3 7.5-6 7c-1.7-.5-5.2-1.8-6-3-.8-1.2-4-4.8-5.5-6.5l-5.5-5H40c-2.3 1.5-8 5.3-12 8.5s-14 .7-18.5-1c-1.8-.1-5-2.9-3-12.5z' fill='BASE_COLOR'/%3E%3Cpath d='M47.5 79.5C26 82.3 25.5 43 28 23l-6 10.5-1.5 23 1.5 23-6-1.5h-6l-4.5 5v9.5L10 96l12 2.5 7-1.5 5.5-4.5 7-4.5h11c1.3 1.2 5.2 5 10 10.5 4.8 5.6 10.3 2.4 12.5 0 2.2-2.5 5.8-8.8 3-14-2.8-5.2-10.2-7.5-13.5-8l2-37-3-12.5s8.5 49.3-16 52.5z' fill='SHADOW_COLOR'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M64.6 74.5v0a3.8 3.8 0 01.3 0l.7.1a25.4 25.4 0 019.8 3.8c3 2 4.8 4.3 5.7 6.9.9 2.6.7 5.1 0 7.4a21.3 21.3 0 01-7 9.8c-2.3 1.7-4.4 2.5-6.4 2a7 7 0 01-2.2-1l-.4-.3-.7-.4a54 54 0 01-8.6-6.3c-1.6-1.4-3.2-3-4-4.7-.4-.9-.8-2.1-.4-3.4a4.2 4.2 0 012.8-2.7c2-.7 3.9-2.9 5.6-5.3a33.5 33.5 0 002.4-4.3V76l.7-1.5h1.7zm1.3 5.2l.8.2c1.5.4 3.6 1.2 6 2.7 2.2 1.5 3.2 3 3.7 4.3.4 1.3.3 2.8-.1 4.3-1 3.1-3.6 6-5.3 7.3-.9.7-1.4 1-1.7 1l-.4.1c-.1 0-.3 0-.7-.3L68 99l-1.4-.8a50.8 50.8 0 01-10-8.2c3.2-1.5 5.7-4.5 7.3-7 .9-1.2 1.6-2.4 2-3.4zm-9.7 9.7z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M66.4 26.2c3 8.1 3.1 18.7 3.1 27.8 0 19-3.7 28.4-9 33-4.7 4-10.1 3.7-13 3.6h-1l-2.6-.2h-.7a4 4 0 00-1.5.1l-2 1.2c-1.2.8-2.6 2-4.5 3.7a19.5 19.5 0 01-12.9 5.3c-3.4 0-6.6-.8-9.2-1.4l-1.2-.4-1.1-.2-2.9-.8c-1.2-.4-2.5-1-3.5-2.4-1-1.3-1.3-3-1.3-4.8-.1-1.8 0-4 .4-7 .4-2.8 1.5-5 3.4-6.5 1.8-1.4 4-2 6-2 2.4-.2 4.8.3 7 1l-1-8.6c-.8-7.2-1.4-16.3-.9-23.3.5-6.7 1.6-14.6 5.5-20.9 4-6.4 10.8-11 22-11.4A21 21 0 0159 15.7c3.5 2.6 5.8 6.4 7.3 10.5zm-41 53.4a2.5 2.5 0 01-3.5 2.7C19.5 81 16 80 13.1 80c-1.4.1-2.4.4-3 1-.7.5-1.4 1.5-1.6 3.2a38 38 0 00-.5 6.2c.1 1.4.4 1.9.5 2 0 .2.3.4 1 .7l2.1.5a111.4 111.4 0 012.9.7c2.6.7 5 1.4 7.7 1.3 3 0 6.1-1 9.7-4 2-1.8 3.5-3.1 4.8-4a9 9 0 016.7-2.3h1l2.1.1h1.6c2.9.2 6.1.3 9-2.3 3.7-3 7.4-10.6 7.4-29.2 0-9.3-.2-19-2.8-26.1a17 17 0 00-5.5-8.1A16 16 0 0045.6 17c-9.6.4-14.8 4.1-17.9 9-3.2 5.2-4.2 12-4.7 18.7-.5 6.5.1 15.2.9 22.4a280.3 280.3 0 001.5 12.3v.2z' fill='%23000'/%3E%3Cpath d='M37 34c2.8-4.8 13.5-5.6 18.5-5.5 9.6-.4 13 1.5 13.5 2.5.5.4 2 2.4 3.5 8 1.6 5.6-2.3 10.4-4.5 12-.2.4-3.7 1.2-16.5 2s-16.7-2.6-17-4.5c-.3-2.8-.3-9.7 2.5-14.5z' fill='%237BD9FA'/%3E%3Cpath d='M52 44c-20 0-11.5-7-5.5-15L40 31.5A27.3 27.3 0 0033.5 42c-2 5.6 2.5 9.4 5 10.5 7.8 1 24.8 2 30-2 5.2-4 3-10.8 2-13.5 0 0 1.5 7-18.5 7z' fill='%23235586'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M53.7 25.3c4.6 0 9.9.2 13.5 1.3 4.5 1.4 6.4 5.3 7.2 8.3a20.7 20.7 0 01.6 6.8c0 .8-.1 1.8-.4 3A12 12 0 0170 52a21.3 21.3 0 01-9.6 3 97 97 0 01-10.6.4h-.2a1947.5 1947.5 0 00-7.6-.1c-2.1-.1-4-.4-5.7-1.2-1.8-.8-3-2-3.8-4-.7-1.7-.9-3.8-.9-6.2 0-10.5 7.3-15.9 11.1-17.3 1.1-.4 2.8-.7 4.6-1l6.5-.4zm16.3 15a9.2 9.2 0 000-1.1c0-.9-.2-2-.5-3-.6-2.4-1.7-4.2-3.7-4.8a65.8 65.8 0 00-21.4 0c-2.5.9-7.9 4.7-7.9 12.6 0 2.2.2 3.5.6 4.4.2.7.6 1 1.2 1.3.8.3 2 .6 3.9.7l6.6.1h.7c3.6 0 7 0 10.2-.3 3.2-.4 5.7-1 7.4-2.2a7 7 0 002.6-4.4 12.5 12.5 0 00.3-2.9V40.4z' fill='%23000'/%3E%3Cpath d='M55.5 36.5c-9 0-5-4.5-1-4.5s11 0 11 2.5-1 2-10 2z' fill='%23fff'/%3E%3Cellipse cx='127.5' cy='113.5' rx='34.5' ry='6.5' fill='%23000' fill-opacity='.7'/%3E%3Cpath d='M97.5 30.9l8 1.5v22l1 18h-14L90 66.9v-24l2.5-8.5 5-3.5z' fill='BASE_COLOR'/%3E%3Cpath d='M106.5 42.4s-10-7-15 0c0 11 .3 32.5 1.5 30.5s9.5-.9 13.5 0V42.4z' fill='SHADOW_COLOR'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M94.5 29.6c4-2.4 8.5-1.7 11.4-.6l1.4.6.2 1.5a344.1 344.1 0 012 38.6 648.1 648.1 0 010 4.3v.3H107h2.5v3l-3-.5h-.4a194.7 194.7 0 00-14-2L90 75l-.4-2.1c-.3-2.2-1-10.5-1.5-26.9-.2-8.6 2.3-13.9 6.5-16.3zm10 41.8v-1.6l-.3-11.2c-.3-8.2-.7-18-1.5-25.4-1.9-.4-4-.4-5.7.7-2 1.1-4.2 4.1-4 11.9.3 12.9.9 20.6 1.2 24.1a91 91 0 0110.3 1.5z' fill='%23000'/%3E%3Cpath d='M91.5 80.5c2-9.6 10.8-6.6 15-4V35l2.5-11.5 9.5-10c5.8-2 19.2-4.3 26 2.5 6.8 6.8 8.2 26.9 8 36L149 72l2.5 2.5L161 78l3 7.5-3 7.5-6 7c-1.7-.5-5.2-1.8-6-3-.8-1.2-4-4.8-5.5-6.5l-5.5-5h-13c-2.3 1.5-8 5.3-12 8.5s-14 .7-18.5-1c-1.8-.1-5-2.9-3-12.5z' fill='BASE_COLOR'/%3E%3Cpath d='M132.5 76.5C111 79.3 110.5 40 113 20l-6 10.5-1.5 23 1.5 23-6-1.5h-6l-4.5 5v9.5L95 93l12 2.5 7-1.5 5.5-4.5 7-4.5h11c1.3 1.2 5.2 5 10 10.5 4.8 5.6 10.3 2.4 12.5 0 2.2-2.5 5.8-8.8 3-14-2.8-5.2-10.2-7.5-13.5-8l2-37-3-12.5s8.5 49.3-16 52.5z' fill='SHADOW_COLOR'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M149.6 71.5v0a3.6 3.6 0 01.3 0 13.2 13.2 0 013 .6c2 .5 4.6 1.5 7.5 3.3 3 2 4.8 4.3 5.7 6.9.9 2.6.7 5.1 0 7.4a21.3 21.3 0 01-7 9.8c-2.3 1.7-4.4 2.5-6.4 2a7 7 0 01-2.2-1l-.4-.3-.7-.4a54 54 0 01-8.6-6.3c-1.6-1.4-3.2-3-4-4.7-.4-.9-.8-2.1-.4-3.4a4.2 4.2 0 012.8-2.7c2-.7 3.9-2.9 5.6-5.3a33.5 33.5 0 002.4-4.3V73l.7-1.5h1.7zm1.3 5.2l.8.2c1.5.4 3.6 1.2 6 2.7 2.2 1.5 3.2 3 3.7 4.3.4 1.3.3 2.8-.1 4.3-1 3.1-3.6 6-5.3 7.3-.9.7-1.4 1-1.7 1l-.4.1c-.1 0-.3 0-.7-.3l-.2-.2a50.7 50.7 0 01-11.4-9c3.2-1.5 5.7-4.5 7.3-7 .9-1.2 1.6-2.4 2-3.4zm-9.7 9.7z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M151.4 23.2c3 8.1 3.1 18.7 3.1 27.8 0 19-3.7 28.4-9 33-4.7 4-10.1 3.7-13 3.6h-1l-2.6-.2h-.7a4 4 0 00-1.5.1l-2 1.2c-1.2.8-2.6 2-4.5 3.7a19.5 19.5 0 01-12.9 5.3c-3.4 0-6.6-.8-9.2-1.4l-1.2-.4-1.1-.2-2.9-.8c-1.2-.4-2.5-1-3.5-2.4-1-1.3-1.3-3-1.3-4.8-.1-1.8 0-4 .4-7 .4-2.8 1.5-5 3.4-6.5 1.8-1.4 4-2 6-2 2.4-.2 4.8.3 7 1l-1-8.6c-.8-7.2-1.4-16.3-.9-23.3.5-6.7 1.6-14.6 5.5-20.9 4-6.4 10.8-11 22-11.4a21 21 0 0113.6 3.7c3.5 2.6 5.8 6.4 7.3 10.5zm-41 53.4a2.5 2.5 0 01-3.5 2.7C104.5 78 101 77 98.1 77c-1.4.1-2.4.4-3 1-.7.5-1.4 1.5-1.6 3.2a38 38 0 00-.5 6.2c.1 1.4.4 1.9.5 2 0 .2.3.4 1 .7l2.1.5a111.4 111.4 0 012.9.7c2.6.7 5 1.4 7.7 1.3 3 0 6.1-1 9.7-4 2-1.8 3.5-3.1 4.8-4a9 9 0 016.7-2.3h1l2.1.1h1.6c2.9.2 6.1.3 9-2.3 3.7-3 7.4-10.6 7.4-29.2 0-9.3-.2-19-2.8-26.1a17 17 0 00-5.5-8.1 16 16 0 00-10.6-2.8c-9.6.4-14.8 4.1-17.9 9-3.2 5.2-4.2 12-4.7 18.7-.5 6.5.1 15.2.9 22.4a280.8 280.8 0 001.5 12.3v.2z' fill='%23000'/%3E%3Cpath d='M122 31c2.8-4.8 13.5-5.6 18.5-5.5 9.6-.4 13 1.5 13.5 2.5.5.4 2 2.4 3.5 8 1.6 5.6-2.3 10.4-4.5 12-.2.4-3.7 1.2-16.5 2s-16.7-2.6-17-4.5c-.3-2.8-.3-9.7 2.5-14.5z' fill='%237BD9FA'/%3E%3Cpath d='M137 41c-20 0-11.5-7-5.5-15l-6.5 2.5a27.3 27.3 0 00-6.5 10.5c-2 5.6 2.5 9.4 5 10.5 7.8 1 24.8 2 30-2 5.2-4 3-10.8 2-13.5 0 0 1.5 7-18.5 7z' fill='%23235586'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M138.7 22.3c4.6 0 9.9.2 13.5 1.3 4.5 1.4 6.4 5.3 7.2 8.3a20.7 20.7 0 01.6 5.2v.7a16.3 16.3 0 01-.4 3.9A12 12 0 01155 49a21.3 21.3 0 01-9.6 3 97 97 0 01-10.6.4h-.2a1951 1951 0 00-7.6-.1c-2.1-.1-4-.4-5.7-1.2-1.8-.8-3-2-3.8-4-.7-1.7-.9-3.8-.9-6.2 0-10.5 7.3-15.9 11.1-17.3 1.1-.4 2.8-.7 4.6-1l6.5-.4zm16.3 15v-.2a15.6 15.6 0 00-.5-4c-.6-2.3-1.7-4-3.7-4.7a65.8 65.8 0 00-21.4 0c-2.5.9-7.9 4.7-7.9 12.6 0 2.2.2 3.5.6 4.4.2.7.6 1 1.2 1.3.8.3 2 .6 3.9.7l6.6.1h.7c3.6 0 7 0 10.2-.3 3.2-.4 5.7-1 7.4-2.2a7 7 0 002.6-4.4 12.4 12.4 0 00.3-2.8v-.4z' fill='%23000'/%3E%3Cpath d='M140.5 33.5c-9 0-5-4.5-1-4.5s11 0 11 2.5-1 2-10 2z' fill='%23fff'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Cpath fill='%23fff' d='M0 0h1020v120H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`;

const COLORS = {
    RED: { base: "%23f31717", shadow: "%23880934" },
    ORANGE: { base: "%23f07d0d", shadow: "%23b43e15" },
    BROWN: { base: "%2371491e", shadow: "%235e2615" },
    YELLOW: { base: "%23fbfb59", shadow: "%23c38822" },
    LIME: { base: "%2350f039", shadow: "%2315a842" },
    GREEN: { base: "%2311802d", shadow: "%230a4d2e" },
    CYAN: { base: "%2338ffdd", shadow: "%2324a9bf" },
    BLUE: { base: "%23132ed1", shadow: "%2309158e" },
    PINK: { base: "%23ee54bb", shadow: "%23ac2bae" },
    PURPLE: { base: "%236b2fbc", shadow: "%233b177c" },
    BLACK: { base: "%233f474e", shadow: "%231e1f26" },
    WHITE: { base: "%23d7e1f1", shadow: "%238495c0" },
};

function getColoredSprite(type: "IDLE" | "WALKING", color: keyof typeof COLORS) {
    const template = type === "IDLE" ? SPRITE_IDLE_TEMPLATE : SPRITE_WALKING_TEMPLATE;
    const { base, shadow } = COLORS[color];
    // Replace placeholders with color values
    // We used unique placeholders in the template strings above
    // Sanitize to remove newlines which might break Data URI in some contexts
    const cleanTemplate = template.replace(/(\r\n|\n|\r)/gm, "");
    return cleanTemplate.replace(/BASE_COLOR/g, base).replace(/SHADOW_COLOR/g, shadow);
}


// --- Game Logic ---

interface Item {
    id: number;
    x: number;
    y: number;
    type: "COIN" | "BOMB";
    spawnTime: number;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
    value: string;
    color: string;
    spawnTime: number;
}


export default function AmongUsGame({ onClose }: { onClose: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<keyof typeof COLORS>("CYAN");

    // Game State Refs (using refs to avoid stale closures in loop)
    const gameState = useRef({
        x: 0,
        y: 0,
        keys: { top: false, right: false, down: false, left: false },
        limits: { xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 },
        playerBounds: { width: 85, height: 150 }, // Approximation
        lastMovement: Date.now(),
        isWalking: false,
        turnLeft: false,
        color: "CYAN" as keyof typeof COLORS,
        spriteFrame: 0,
        lastFrameTime: 0,
        lastSpawnTime: 0,

        items: [] as Item[], // Keep track in ref for game loop (avoids stale closures)
        floatingTexts: [] as FloatingText[],
    });

    const [score, setScore] = useState(0);
    const [renderItems, setRenderItems] = useState<Item[]>([]); // For React rendering
    const [renderTexts, setRenderTexts] = useState<FloatingText[]>([]);


    useEffect(() => {
        // Initialize Limits
        const updateLimits = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            gameState.current.limits = {
                // Add padding to keep player inside "screen"
                xStart: 80,
                yStart: 200, // Top bar is ~150px, adding buffer
                xEnd: rect.width - 20,
                yEnd: rect.height - 20
            };

            // Ensure player starts within bounds
            if (gameState.current.y < gameState.current.limits.yStart) {
                gameState.current.y = gameState.current.limits.yStart;
            }

            // Center player initially if at 0,0, but respect yStart
            if (gameState.current.x === 0 && gameState.current.y === 200) {
                gameState.current.x = rect.width / 2 - gameState.current.playerBounds.width / 2;
                gameState.current.y = Math.max(200, rect.height / 2 - gameState.current.playerBounds.height / 2);
            }
        };

        // Initialize Limits with delay to wait for CRT turnOn animation (0.4s)
        const initTimout = setTimeout(() => {
            updateLimits();
        }, 500);

        window.addEventListener("resize", updateLimits);

        const handleKeyDown = (ev: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(ev.code)) {
                ev.preventDefault();
            }
            switch (ev.code) {
                case "ArrowLeft": case "KeyA": gameState.current.keys.left = true; break;
                case "ArrowRight": case "KeyD": gameState.current.keys.right = true; break;
                case "ArrowDown": case "KeyS": gameState.current.keys.down = true; break;
                case "ArrowUp": case "KeyW": gameState.current.keys.top = true; break;
            }
        };

        const handleKeyUp = (ev: KeyboardEvent) => {
            switch (ev.code) {
                case "ArrowLeft": case "KeyA": gameState.current.keys.left = false; break;
                case "ArrowRight": case "KeyD": gameState.current.keys.right = false; break;
                case "ArrowDown": case "KeyS": gameState.current.keys.down = false; break;
                case "ArrowUp": case "KeyW": gameState.current.keys.top = false; break;
            }
        };

        // Attach to window to capture keys even if focus is lost slightly, 
        // but maybe scope to modal if possible? Window is safer for game feel.
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // Game Loop
        const loop = () => {
            const state = gameState.current;
            const speed = 6; // slightly faster than original for smoothness
            let moved = false;

            // Logic from original code ported and optimized
            if (state.keys.left && state.x - speed > state.limits.xStart) {
                state.x -= speed;
                state.turnLeft = true;
                moved = true;
            }
            if (state.keys.right && state.x + state.playerBounds.width + speed < state.limits.xEnd) {
                state.x += speed;
                state.turnLeft = false;
                moved = true;
            }
            if (state.keys.top && state.y - speed > state.limits.yStart) {
                state.y -= speed;
                moved = true;
            }
            if (state.keys.down && state.y + state.playerBounds.height + speed < state.limits.yEnd) {
                state.y += speed;
                moved = true;
            }

            // Animation Logic
            if (moved) {
                // Determine animation frame
                const now = Date.now();
                if (now - state.lastFrameTime > 150) {
                    // Cycle: 0 (Walk1) -> 1 (Stand) -> 2 (Walk2) -> 3 (Stand)
                    state.spriteFrame = (state.spriteFrame + 1) % 4;
                    state.lastFrameTime = now;
                }
            } else {
                state.spriteFrame = 0; // Reset
            }

            // --- Item Spawning & Collision ---
            const now = Date.now();

            // Spawn every 2 seconds
            if (now - state.lastSpawnTime > 2000) {
                const isCoin = Math.random() > 0.3; // 70% Coin, 30% Bomb
                let spawnX = 0;
                let spawnY = 0;
                let validSpawn = false;
                let attempts = 0;

                // Attempt to find a non-overlapping spawn point (up to 5 tries)
                while (!validSpawn && attempts < 5) {
                    spawnX = Math.random() * (state.limits.xEnd - state.limits.xStart - 60) + state.limits.xStart;
                    spawnY = Math.random() * (state.limits.yEnd - state.limits.yStart - 60) + state.limits.yStart;

                    // Calculate distance to player center
                    const playerCenterX = state.x + state.playerBounds.width / 2;
                    const playerCenterY = state.y + state.playerBounds.height / 2;
                    const itemCenterX = spawnX + 30;
                    const itemCenterY = spawnY + 30;

                    const dx = playerCenterX - itemCenterX;
                    const dy = playerCenterY - itemCenterY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Ensure at least 150px away from player center
                    if (dist > 150) {
                        validSpawn = true;
                    }
                    attempts++;
                }

                if (validSpawn) {
                    const newItem: Item = {
                        id: now,
                        x: spawnX,
                        y: spawnY,
                        type: isCoin ? "COIN" : "BOMB",
                        spawnTime: now
                    };

                    state.items.push(newItem);
                    state.lastSpawnTime = now;

                    // Trigger render update
                    setRenderItems([...state.items]);
                }
            }

            // Collision Detection
            // Player Rect (approximate) - x,y is topleft. Width 85, Height 150.
            // Hitbox now covers almost the entire sprite (Hat to Feet)
            const playerHitbox = {
                x: state.x + 5,
                y: state.y + 5,
                width: 75,
                height: 140
            };

            let scoreChanged = false;
            let currentScoreChange = 0;

            // Filter out collected items
            const activeItems = state.items.filter(item => {
                const itemHitbox = { x: item.x, y: item.y, width: 60, height: 60 }; // 60x60 item size from CSS

                // AABB Collision
                const isColliding = (
                    playerHitbox.x < itemHitbox.x + itemHitbox.width &&
                    playerHitbox.x + playerHitbox.width > itemHitbox.x &&
                    playerHitbox.y < itemHitbox.y + itemHitbox.height &&
                    playerHitbox.y + playerHitbox.height > itemHitbox.y
                );

                if (isColliding) {
                    let text = "";
                    let color = "";

                    if (item.type === "COIN") {
                        currentScoreChange += 10;
                        text = "+10";
                        color = "#4ade80"; // Green (Tailwind green-400 equivalent, visible on dark bg)
                    } else {
                        currentScoreChange -= 10;
                        text = "-10";
                        color = "#ff3333";
                    }

                    // Spawn Floating Text
                    state.floatingTexts.push({
                        id: Date.now() + Math.random(),
                        x: item.x,
                        y: item.y,
                        value: text,
                        color: color,
                        spawnTime: Date.now()
                    });

                    scoreChanged = true;
                    return false; // Remove from list
                }

                // Also remove old items (> 10s)
                if (now - item.spawnTime > 10000) return false;

                return true;
            });

            // Cleanup old floating texts
            const activeTexts = state.floatingTexts.filter(t => now - t.spawnTime < 1000); // 1s animation duration

            if (state.items.length !== activeItems.length || state.floatingTexts.length !== activeTexts.length) {
                state.items = activeItems;
                state.floatingTexts = activeTexts;

                setRenderItems([...state.items]);
                setRenderTexts([...state.floatingTexts]);

                if (scoreChanged) {
                    setScore(prev => prev + currentScoreChange);
                }
            }


            // Determine if showing walking sprite (Frames 0 and 2)
            // Frame 1 and 3 are "Stand" (Idle)
            // However, we still consider the state "walking" for the Hat animation to play continuously?
            // User said "walk - stand - walk - stand". If we make it Stand, the hat should probably also stop bouncing or reset?
            // Let's stick to strict interpretation: Visual state matches "Walk" or "Idle".

            const isVisualWalk = moved && (state.spriteFrame === 0 || state.spriteFrame === 2);

            // Map Frame 2 to Sprite Index 1 (since we only have 2 walk frames in SVG)
            const walkSpriteIndex = state.spriteFrame === 2 ? 1 : 0;

            // Update DOM
            if (playerRef.current) {
                playerRef.current.style.setProperty("--x", state.x + "px");
                playerRef.current.style.setProperty("--y", state.y + "px");

                // Js driven sprite position for walking frames
                const bgPos = -(walkSpriteIndex * 85);
                playerRef.current.style.setProperty("--bg-pos-x", bgPos + "px");

                // Classes - Toggle Walking Class based on frame
                // When isVisualWalk is false, it falls back to Idle sprite (CSS default)
                playerRef.current.classList.toggle(styles.playerWalking, isVisualWalk);
                playerRef.current.classList.toggle(styles.playerTurnLeft, state.turnLeft);
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("resize", updateLimits);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Handle color change effect
    useEffect(() => {
        gameState.current.color = selectedColor;
        if (playerRef.current) {
            playerRef.current.style.setProperty(
                "--sprite-idle-url",
                `url("${getColoredSprite("IDLE", selectedColor)}")`
            );
            playerRef.current.style.setProperty(
                "--sprite-walking-url",
                `url("${getColoredSprite("WALKING", selectedColor)}")`
            );
        }
    }, [selectedColor]);

    // Prevent Scroll propagation when in modal
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // Track score in ref for reliable unmount saving
    const scoreRef = useRef(score);
    const isLoaded = useRef(false); // Guard against saving before loading

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    // Fetch initial score
    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data.amongUsScore !== undefined) {
                    setScore(data.amongUsScore);
                    scoreRef.current = data.amongUsScore;
                }
                isLoaded.current = true; // Mark as loaded
            })
            .catch(err => {
                console.error("Failed to fetch score", err);
                isLoaded.current = true; // Allow saving even if fetch failed (start from 0)
            });
    }, []);

    // Save score on unmount
    useEffect(() => {
        return () => {
            // Only save if we actually loaded data, to avoid overwriting with 0 on immediate close
            if (!isLoaded.current) return;

            const finalScore = scoreRef.current;
            fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amongUsScore: finalScore }),
                keepalive: true,
            }).catch(err => console.error("Failed to save score", err));
        };
    }, []);

    // Auto-save periodically (debounce)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isLoaded.current) return;

            fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amongUsScore: score })
            }).catch(err => console.error("Failed to auto-save score", err));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [score]);


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.tvFrame}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.screenContainer}>
                    <div className={styles.glow} />
                    <div className={styles.scanlines} />
                    {/* Game Container logic from original CSS applied here */}
                    <div ref={containerRef} className={`${styles.container} ${styles.crtEffect}`}>
                        <div className={styles.scoreBoard}>SCORE: {score}</div>

                        {renderItems.map(item => (
                            <div
                                key={item.id}
                                className={`${styles.item} ${item.type === "COIN" ? styles.coin : styles.bomb}`}
                                style={{ "--x": `${item.x}px`, "--y": `${item.y}px` } as React.CSSProperties}
                            />
                        ))}

                        {renderTexts.map(text => (
                            <div
                                key={text.id}
                                className={styles.floatingText}
                                style={{
                                    "--start-x": `${text.x}px`,
                                    "--start-y": `${text.y}px`,
                                    color: text.color
                                } as React.CSSProperties}
                            >
                                {text.value}
                            </div>
                        ))}

                        <div ref={playerRef} className={styles.player} />


                        <div className={styles.custom}>
                            <ul className={styles.palette}>
                                {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((color) => (
                                    <li key={color}>
                                        <label
                                            className={`${styles.color} ${styles[`color${color.charAt(0) + color.slice(1).toLowerCase()}`]}`}
                                        >
                                            <input
                                                type="radio"
                                                name="colors"
                                                value={color}
                                                className={styles.colorInput}
                                                checked={selectedColor === color}
                                                onChange={() => setSelectedColor(color)}
                                            />
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

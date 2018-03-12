import {
  fontSize,
  fontFamily,
  fill,
  stroke,
  strokeWidth,
} from 'config/moduleConfig';

export const modulesData = [
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#01579b',
    width: 254,
    height: 133,
    rotation: 0,
    boundToSideIndex: null,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'COM Connector',
    textX: 76,
    textY: 32,
    imageX: 2,
    imageY: 4,
    imageWidth: 250,
    imageHeight: 125,
    imageSrc: 'images/COM-connector.svg',
    imageNode: null,
    iconSrc: 'images/COM-connector.svg',
    iconHeight: '70px',
    price: 48,
    info: null,
    id: '105',
    dependencies: ['109'],
    hasTooltip: true,
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#0288d1',
    width: 120,
    height: 100,
    rotation: 0,
    boundToSideIndex: 2,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'HDMI Connector',
    textX: 22.5,
    textY: 35,
    imageX: 15,
    imageY: -2,
    imageWidth: 90,
    imageHeight: 70,
    imageSrc: 'images/hdmi-connector.svg',
    imageNode: null,
    iconSrc: 'images/hdmi-connector-icon.svg',
    iconHeight: '70px',
    price: 3.25,
    info: null,
    id: '112',
    dependencies: ['105'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#7e57c2',
    width: 95,
    height: 82,
    rotation: 0,
    boundToSideIndex: 0,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'MicroSD Slot',
    textX: 10,
    textY: 20,
    imageX: 3.5,
    imageY: 4.5,
    imageWidth: 86,
    imageHeight: 75,
    imageSrc: 'images/microsd-slot.svg',
    imageNode: null,
    iconSrc: 'images/microsd-slot-icon.svg',
    iconHeight: '70px',
    price: 5,
    info: null,
    id: '101',
    dependencies: ['105'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#009688',
    width: 175,
    height: 225,
    rotation: 0,
    boundToSideIndex: 0,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'USB Ethernet Module',
    textX: 40,
    textY: 32.5,
    imageX: 35,
    imageY: 90,
    imageWidth: 105,
    imageHeight: 145,
    imageSrc: 'images/usb-ethernet-module-2.svg',
    imageNode: null,
    iconSrc: 'images/usb-ethernet-module-icon.svg',
    iconHeight: '70px',
    price: 12,
    info: null,
    id: '102',
    dependencies: ['103', '105', '111'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#00796b',
    width: 60,
    height: 60,
    rotation: 0,
    boundToSideIndex: null,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'USB Hub 4 Port',
    textX: 5,
    textY: 12.5,
    imageX: 20,
    imageY: 10,
    imageWidth: 30,
    imageHeight: 30,
    imageSrc: 'images/USB-hub-4-port.svg',
    imageNode: null,
    iconSrc: 'images/USB-hub-4-port-icon.svg',
    iconHeight: '70px',
    price: 2.25,
    info: null,
    id: '103',
    dependencies: ['105', '111'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#0277bd',
    width: 60,
    height: 40,
    rotation: 0,
    boundToSideIndex: 0,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'Micro-B Jack',
    textX: 7.5,
    textY: 5,
    imageX: 7.5,
    imageY: 14,
    imageWidth: 46,
    imageHeight: 31,
    imageSrc: 'images/micro-b-jack.svg',
    imageNode: null,
    iconSrc: 'images/micro-b-jack-icon.svg',
    iconHeight: '70px',
    price: 2.25,
    info: null,
    id: '104',
    dependencies: ['105'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#009688',
    width: 120,
    height: 170,
    rotation: 0,
    boundToSideIndex: 0,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'USB Type-A Jack',
    textX: 19,
    textY: 55,
    imageX: 10,
    imageY: 35,
    imageWidth: 100,
    imageHeight: 135,
    imageSrc: 'images/dual-stacked-usb.svg',
    imageNode: null,
    iconSrc: 'images/dual-stacked-usb-icon.svg',
    iconHeight: '70px',
    price: 13.5,
    info: null,
    id: '106',
    dependencies: ['109'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#01579b',
    width: 35,
    height: 35,
    rotation: 0,
    boundToSideIndex: null,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'Tactile Switch',
    textX: 4,
    textY: 8,
    imageX: 5,
    imageY: 5,
    imageWidth: 25,
    imageHeight: 25,
    imageSrc: 'images/tactile-switch.svg',
    imageNode: null,
    iconSrc: 'images/tactile-switch-icon.svg',
    iconHeight: '70px',
    price: 1.2,
    info: null,
    id: '107',
    dependencies: ['105'],

  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#0288d1',
    width: 30,
    height: 30,
    rotation: 0,
    boundToSideIndex: null,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'LED',
    textX: 6,
    textY: 11,
    imageX: 3.75,
    imageY: 8,
    imageWidth: 22.5,
    imageHeight: 14,
    imageSrc: 'images/LED.svg',
    imageNode: null,
    iconSrc: 'images/LED-icon.svg',
    iconHeight: '70px',
    price: 9.75,
    info: null,
    id: '108',
    dependencies: ['105'],

  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#7e57c2',
    width: 65,
    height: 100,
    rotation: 0,
    boundToSideIndex: null,
    innerGroupX: 0,
    innerGroupY: 0,
    text: '5V/5A Regulator',
    textX: 15,
    textY: 25,
    imageX: 12.5,
    imageY: 10,
    imageWidth: 40,
    imageHeight: 80,
    imageSrc: 'images/regulator-5V5A.svg',
    imageNode: null,
    iconSrc: 'images/regulator-5V5A-icon.svg',
    iconHeight: '70px',
    price: 9.75,
    info: null,
    id: '109',
    dependencies: ['110'],
    hasTooltip: true,
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#37474f',
    width: 75,
    height: 75,
    rotation: 0,
    boundToSideIndex: null,
    text: '3.5V/1.5A Regulator',
    textX: 15,
    textY: 20,
    innerGroupX: null,
    innerGroupY: null,
    imageX: null,
    imageY: null,
    imageWidth: null,
    imageHeight: null,
    imageSrc: 'images/transparent-dummy-image.svg',
    iconSrc: 'images/regulator-icon.svg',
    iconHeight: '70px',
    price: 4.25,
    info: null,
    id: '111',
    dependencies: ['110'],
  },
  {
    fontSize,
    fontFamily,
    fill,
    strokeWidth,
    stroke: '#00796b',
    width: 90,
    height: 110,
    rotation: 0,
    boundToSideIndex: 0,
    innerGroupX: 0,
    innerGroupY: 0,
    text: 'Barrel Connector (20V 3A)',
    textX: 10,
    textY: 25,
    imageX: 10,
    imageY: 10,
    imageWidth: 70,
    imageHeight: 100,
    imageSrc: 'images/barrel-connector.svg',
    imageNode: null,
    iconSrc: 'images/barrel-connector-icon.svg',
    iconHeight: '70px',
    price: 5,
    info: null,
    id: '110',
    dependencies: [],
    hasTooltip: true,
  },
];

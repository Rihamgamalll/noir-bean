import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest { return { name:'NØIR BEAN', short_name:'NØIR BEAN', description:'Good Coffee. Good Day.', start_url:'/', display:'standalone', background_color:'#21120c', theme_color:'#21120c', icons:[{src:'/favicon.ico',sizes:'any',type:'image/x-icon'}] }; }

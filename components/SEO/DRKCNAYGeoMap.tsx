'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

interface GeoMapProps {
    city: string;
    latitude: number;
    longitude: number;
    branchName: string;
}

export default function DRKCNAYGeoMap({ city, latitude, longitude, branchName }: GeoMapProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const mapRef = useRef<any>(null);
    const pickerRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleScriptLoad = async () => {
        await customElements.whenDefined('gmp-map');

        const map = mapRef.current;
        const marker = markerRef.current;
        const placePicker = pickerRef.current;
        const google = (window as any).google;

        if (!map || !marker || !placePicker || !google) return;

        const infowindow = new google.maps.InfoWindow();

        setTimeout(() => {
            if (map.innerMap) {
                map.innerMap.setOptions({
                    mapTypeControl: false
                });
            }
        }, 100);

        placePicker.addEventListener('gmpx-placechange', () => {
            const place = placePicker.value;

            if (!place.location) {
                window.alert("Konum detayları bulunamadı: '" + place.name + "'");
                infowindow.close();
                marker.position = null;
                return;
            }

            if (place.viewport) {
                map.innerMap.fitBounds(place.viewport);
            } else {
                map.center = place.location;
                map.zoom = 17;
            }

            marker.position = place.location;
            infowindow.setContent(`
                <div style="color: #000; padding: 8px; font-family: sans-serif; max-width: 250px;">
                    <strong style="color: #ff8600; font-size: 15px;">DRKCNAY Elite Hedef Konum:</strong><br>
                    <span style="font-size: 14px; color: #111; font-weight: 600;">${place.displayName}</span><br>
                    <span style="font-size: 12px; color: #555;">${place.formattedAddress}</span><br><br>
                    <div style="background: #ff8600; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; text-align: center;">
                        📍 Bulunduğunuz konuma 15 dk mesafede Kaporasız VIP partnerler mevcuttur.
                    </div>
                </div>
            `);
            infowindow.open(map.innerMap, marker);
        });
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-[500px] bg-zinc-950 border border-zinc-900 rounded-[2rem] animate-pulse flex items-center justify-center">
                <span className="text-zinc-600 font-bold italic tracking-tighter uppercase">Locator Booting...</span>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden bg-black border border-zinc-900 rounded-[2rem] shadow-[0_0_50px_rgba(255,134,0,0.1)] group">
            <style dangerouslySetInnerHTML={{ __html: `
              .place-picker-container {
                padding: 20px;
                width: 350px;
                max-width: 90%;
              }
              gmpx-place-picker {
                --gmpx-color-surface: #0a0a0a;
                --gmpx-color-on-surface: #f4f4f5;
                --gmpx-color-on-surface-variant: #a1a1aa;
                --gmpx-color-primary: #ff8600;
                --gmpx-color-outline: #27272a;
              }
            `}} />

            <Script 
                type="module" 
                src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js" 
                onLoad={handleScriptLoad}
            />

            {/* @ts-ignore */}
            <gmpx-api-loader key={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCJrkR6g0LqhMj32rq6GT8dpmpUDskyqiQ"} solution-channel="GMP_GE_mapsandplacesautocomplete_v2"></gmpx-api-loader>
            
            {/* @ts-ignore */}
            <gmp-map ref={mapRef} center={`${latitude},${longitude}`} zoom="13" map-id="DEMO_MAP_ID" style={{ height: '500px', width: '100%' }}>
                <div slot="control-block-start-inline-start" className="place-picker-container">
                    {/* @ts-ignore */}
                    <gmpx-place-picker ref={pickerRef} placeholder="Otel veya Bulunduğunuz Yeri Arayın..."></gmpx-place-picker>
                </div>
                {/* @ts-ignore */}
                <gmp-advanced-marker ref={markerRef}></gmp-advanced-marker>
            {/* @ts-ignore */}
            </gmp-map>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": `${branchName} Escort VIP`,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": city,
                            "addressCountry": "TR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": latitude,
                            "longitude": longitude
                        }
                    })
                }}
            />
        </div>
    );
}

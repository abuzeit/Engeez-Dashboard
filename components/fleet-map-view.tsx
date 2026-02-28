"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useTheme } from "next-themes"
import { Search, MapPin, LocateFixed, Eye, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

if (typeof window !== "undefined") {
    // Add RTL support for Arabic text on the map
    if (maplibregl.getRTLTextPluginStatus && maplibregl.getRTLTextPluginStatus() === 'unavailable') {
        maplibregl.setRTLTextPlugin(
            'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
            // @ts-ignore - maplibre-gl @types is missing the `deferred` boolean parameter but it is supported
            true // Lazy load the plugin
        )
    }
}

export type FleetItem = {
    id: string
    status: string
    location: string
    latitude: number
    longitude: number
    driver: string
    load: string
}

interface FleetMapViewProps {
    data: FleetItem[]
}

export function FleetMapView({ data }: FleetMapViewProps) {
    const mapContainer = React.useRef<HTMLDivElement>(null)
    const map = React.useRef<maplibregl.Map | null>(null)
    const markersRef = React.useRef<{ [id: string]: maplibregl.Marker }>({})
    const { theme } = useTheme()
    const [search, setSearch] = React.useState("")
    const [mapLoaded, setMapLoaded] = React.useState(false)

    // Calculate bounds from data
    const getBounds = React.useCallback(() => {
        if (!data || data.length === 0) return null

        const bounds = new maplibregl.LngLatBounds()
        let hasValidCoords = false

        data.forEach((item) => {
            if (item.longitude && item.latitude) {
                bounds.extend([item.longitude, item.latitude])
                hasValidCoords = true
            }
        })

        return hasValidCoords ? bounds : null
    }, [data])

    // Initialize Map
    React.useEffect(() => {
        if (!mapContainer.current) return

        const styleUrl = theme === "dark"
            ? "https://tiles.openfreemap.org/styles/liberty"
            : "https://tiles.openfreemap.org/styles/bright"

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: [55.3, 25.2], // Default UAE center roughly
            zoom: 7,
            attributionControl: false, // We'll add our own if needed or rely on default OpenFreeMap text
        })

        // Add standard controls
        map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")

        map.current.on('load', () => {
            setMapLoaded(true)
            const bounds = getBounds()
            if (bounds && map.current) {
                map.current.fitBounds(bounds, { padding: 50, duration: 0 })
            }
        })

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [theme]) // Re-init on theme change to swap base layer style easily

    // Helper: get color by status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Moving": return "#10b981" // Emerald
            case "Idle": return "#eab308" // Yellow
            case "Loading": return "#3b82f6" // Blue
            case "Maintenance": return "#ef4444" // Red
            default: return "#6b7280" // Gray
        }
    }

    // Add / Update Markers when data or map changes
    React.useEffect(() => {
        if (!mapLoaded || !map.current || !data) return

        // Clear existing markers if we re-render
        // Optimization: In a real heavy app, we'd diff them. For 100s of items, rebuilding is fine.
        Object.values(markersRef.current).forEach(m => m.remove())
        markersRef.current = {}

        data.forEach((item) => {
            if (!item.latitude || !item.longitude) return

            // Create custom HTML marker container
            const el = document.createElement('div')
            el.className = 'relative flex flex-col items-center group/marker'

            // Create visual representation
            const innerEl = document.createElement('div')
            innerEl.className = 'w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-all group-hover/marker:scale-125 duration-300 relative z-10'
            innerEl.style.backgroundColor = getStatusColor(item.status)
            innerEl.style.boxShadow = `0 0 10px ${getStatusColor(item.status)}88` // Subtle glow

            // Tooltip label that appears on hover/click showing the vehicle ID
            const labelEl = document.createElement('div')
            labelEl.className = 'absolute top-full mt-1 px-1.5 py-0.5 rounded bg-background/95 border border-border shadow-sm text-[10px] font-bold opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none'
            labelEl.innerText = item.id

            el.appendChild(innerEl)
            el.appendChild(labelEl)

            // Create Popup content
            const popupHtml = `
                <div class="p-2 min-w-[200px]">
                    <div class="flex items-start justify-between mb-2 pb-2 border-b gap-4">
                        <div>
                            <p class="text-[10px] uppercase text-muted-foreground font-semibold leading-none mb-1">Vehicle ID</p>
                            <h4 class="font-bold text-sm tracking-tight text-primary leading-none">${item.id}</h4>
                        </div>
                        <span class="text-xs px-2 py-0.5 rounded-full text-white shadow-sm" style="background-color: ${getStatusColor(item.status)}">
                            ${item.status}
                        </span>
                    </div>
                    <div class="space-y-1 text-sm mt-3">
                        <p><span class="text-muted-foreground font-medium">Driver:</span> ${item.driver}</p>
                        <p><span class="text-muted-foreground font-medium">Location:</span> ${item.location}</p>
                        <p><span class="text-muted-foreground font-medium">Load:</span> ${item.load}</p>
                    </div>
                    <a href="/dashboard/fleet/${item.id}" class="mt-4 block w-full text-center text-xs bg-primary/10 text-primary py-1.5 rounded-md hover:bg-primary/20 transition-colors font-medium">
                       View Details
                    </a>
                </div>
            `

            const popup = new maplibregl.Popup({ offset: 15, closeButton: false, className: "fleet-popup" })
                .setHTML(popupHtml)

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([item.longitude, item.latitude])
                .setPopup(popup)
                .addTo(map.current!)

            // Explicitly handle click to center the map and ensure popup shows
            el.addEventListener('click', (e) => {
                e.stopPropagation()
                map.current?.flyTo({
                    center: [item.longitude, item.latitude],
                    zoom: 12,
                    speed: 1.2
                })

                // Close all other popups
                Object.values(markersRef.current).forEach(m => {
                    const p = m.getPopup()
                    if (p && p.isOpen() && m !== marker) {
                        m.togglePopup()
                    }
                })

                if (!popup.isOpen()) {
                    marker.togglePopup()
                }
            })

            markersRef.current[item.id] = marker
        })

    }, [mapLoaded, data])

    // Handle Search functionality
    React.useEffect(() => {
        if (!mapLoaded || !map.current) return

        const term = search.toLowerCase()

        data.forEach(item => {
            const marker = markersRef.current[item.id]
            if (!marker) return

            const matches = !term ||
                item.id.toLowerCase().includes(term) ||
                item.driver.toLowerCase().includes(term) ||
                item.location.toLowerCase().includes(term) ||
                item.status.toLowerCase().includes(term) ||
                item.load.toLowerCase().includes(term)

            const el = marker.getElement()
            const innerEl = el.firstChild as HTMLDivElement

            if (matches) {
                innerEl.style.opacity = '1'
                innerEl.style.transform = 'scale(1)'
                el.style.zIndex = '10'
            } else {
                innerEl.style.opacity = '0.3'
                innerEl.style.transform = 'scale(0.8)'
                el.style.zIndex = '1'
                if (marker.getPopup().isOpen()) {
                    marker.togglePopup()
                }
            }
        })
    }, [search, data, mapLoaded])

    const handleSearch = () => {
        if (!mapLoaded || !map.current || !search) return

        const term = search.toLowerCase()
        const match = data.find(item =>
            item.id.toLowerCase().includes(term) ||
            item.driver.toLowerCase().includes(term) ||
            item.location.toLowerCase().includes(term) ||
            item.status.toLowerCase().includes(term) ||
            item.load.toLowerCase().includes(term)
        )

        if (match && match.longitude && match.latitude) {
            map.current.flyTo({
                center: [match.longitude, match.latitude],
                zoom: 12,
                speed: 1.2
            })

            // Close all popups first
            Object.values(markersRef.current).forEach(m => {
                const p = m.getPopup()
                if (p && p.isOpen()) {
                    m.togglePopup()
                }
            })

            const marker = markersRef.current[match.id]
            if (marker && !marker.getPopup().isOpen()) {
                marker.togglePopup()
            }
        }
    }

    const handleResetView = () => {
        if (!map.current) return
        setSearch("")

        // Close any currently open popups
        Object.values(markersRef.current).forEach(marker => {
            const popup = marker.getPopup()
            if (popup && popup.isOpen()) {
                marker.togglePopup()
            }
        })

        const bounds = getBounds()
        if (bounds) {
            map.current.fitBounds(bounds, { padding: 50, duration: 1000 })
        }
    }

    const handleGeolocate = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (map.current) {
                        map.current.flyTo({
                            center: [position.coords.longitude, position.coords.latitude],
                            zoom: 12,
                            speed: 1.2
                        })
                    }
                },
                (error) => {
                    console.error("Error getting location", error)
                    alert("Could not get your current location. Please ensure location permissions are granted.")
                },
                { enableHighAccuracy: true }
            )
        } else {
            alert("Geolocation is not supported by your browser.")
        }
    }

    return (
        <div className="flex flex-col space-y-4 h-[600px] relative">
            {/* Map Action Bar */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
                <div className="flex gap-2 p-1.5 bg-background/95 backdrop-blur shadow-md rounded-lg border border-border">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search ID, driver, location..."
                            className="pl-9 pr-8 bg-transparent border-0 focus-visible:ring-0 h-10 w-full shadow-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {search && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleResetView}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Button onClick={handleSearch} className="h-10 px-4">
                        Search
                    </Button>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <TooltipProvider delay={300}>
                <div className="absolute top-[78px] right-2.5 z-10 flex flex-col gap-2">
                    <Tooltip>
                        <TooltipTrigger render={
                            <Button
                                variant="secondary"
                                size="icon"
                                className="bg-background/95 backdrop-blur shadow-[0_0_0_2px_rgba(0,0,0,0.1)] hover:bg-background h-[29px] w-[29px] rounded overflow-hidden"
                                onClick={handleGeolocate}
                            >
                                <MapPin className="h-4 w-4 text-primary" />
                            </Button>
                        } />
                        <TooltipContent side="left" align="center" sideOffset={8}>
                            Fly to My Location
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger render={
                            <Button
                                variant="secondary"
                                size="icon"
                                className="bg-background/95 backdrop-blur shadow-[0_0_0_2px_rgba(0,0,0,0.1)] hover:bg-background h-[29px] w-[29px] rounded overflow-hidden"
                                onClick={handleResetView}
                            >
                                <LocateFixed className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        } />
                        <TooltipContent side="left" align="center" sideOffset={8}>
                            Reset Map View
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            {/* Map Container */}
            <div
                ref={mapContainer}
                className="w-full h-full rounded-md border border-muted-foreground/20 overflow-hidden shadow-inner"
            />

            {/* Injected styles for popup padding reset */}
            <style dangerouslySetInnerHTML={{
                __html: `
               .fleet-popup .maplibregl-popup-content {
                   padding: 0;
                   border-radius: 0.5rem;
                   overflow: hidden;
                   border: 1px solid var(--border);
                   background: var(--background);
                   color: var(--foreground);
                   box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
               }
               .fleet-popup .maplibregl-popup-tip {
                   border-top-color: var(--background);
               }
               html.dark .fleet-popup .maplibregl-popup-content {
                   border-color: rgba(255,255,255,0.1);
               }
               html.dark .fleet-popup .maplibregl-popup-tip {
                   border-top-color: var(--background);
               }
            `}} />
        </div>
    )
}

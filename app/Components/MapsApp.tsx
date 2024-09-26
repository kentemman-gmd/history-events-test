"use client";
import React, { useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import eventsData from "../historyEvents";
import Filter from "./Filter";

export interface HistoricalEvent {
  id: number;
  title: string;
  description: string;
  position: [number, number];
  category: string;
}

const defaultPosition: [number, number] = [51.505, -0.09];

// Mapbox access token
const MAPBOX_TOKEN = "pk.eyJ1IjoiMHhrZW50ZW1tYW4iLCJhIjoiY2x6YXdpdXdwMGJ3azJrb2Uxb2lud3JlZSJ9.LmaF-836JjB5Nc4r9nx-3w"; // Replace with your Mapbox token

const emptyStar = <i className="fa-regular fa-star"></i>;
const fullStar = <i className="fa-solid fa-star" style={{ color: "#fdc401" }}></i>;

function MapsApp() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);
  const [favourites, setFavourites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem("favourites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [viewport, setViewport] = useState({
    longitude: defaultPosition[1],
    latitude: defaultPosition[0],
    zoom: 13,
  });

  // Prepare the GeoJSON data structure for clustering
  const geoJsonData = {
    type: "FeatureCollection",
    features: eventsData.map((event) => ({
      type: "Feature",
      properties: {
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
      },
      geometry: {
        type: "Point",
        coordinates: [event.position[1], event.position[0]],
      },
    })),
  };

  const handleFavouriteClick = (eventId: number) => {
    let updatedFavourites = favourites.filter((id) => id !== eventId);
    if (!favourites.includes(eventId)) {
      updatedFavourites = [eventId, ...updatedFavourites];
    }
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  const handleListItemClick = (eventId: number) => {
    const event = eventsData.find((event) => event.id === eventId);
    if (event) {
      setActiveEvent(event);
      setViewport({
        ...viewport,
        latitude: event.position[0],
        longitude: event.position[1],
        zoom: 15,
      });
    }
  };

  return (
    <div className="content">
      <div className="map-content flex flex-col gap-6 h-full">
        <Filter setSelectedCategory={setSelectedCategory} />
        <Map
          {...viewport}
          style={{ width: "100%", height: "500px" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          {/* Source for clustering */}
          <Source
            id="events"
            type="geojson"
            data={geoJsonData}
            cluster={true}
            clusterMaxZoom={14} // Max zoom to cluster points on
            clusterRadius={50} // Radius of each cluster when clustering points (in pixels)
          >
            {/* Layer for clustered points */}
            <Layer
              id="clusters"
              type="circle"
              source="events"
              filter={["has", "point_count"]}
              paint={{
                "circle-color": [
                  "step",
                  ["get", "point_count"],
                  "#51bbd6", // color for small clusters
                  100, // cluster size threshold
                  "#f1f075", // color for medium clusters
                  750, // larger threshold
                  "#f28cb1", // color for large clusters
                ],
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  20, // radius for small clusters
                  100, // cluster size threshold
                  30, // radius for medium clusters
                  750, // larger threshold
                  40, // radius for large clusters
                ],
              }}
            />

            {/* Layer for the cluster count */}
            <Layer
              id="cluster-count"
              type="symbol"
              source="events"
              filter={["has", "point_count"]}
              layout={{
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
              }}
            />

            {/* Layer for individual (non-clustered) points */}
            <Layer
              id="unclustered-point"
              type="circle"
              source="events"
              filter={["!", ["has", "point_count"]]}
              paint={{
                "circle-color": "#11b4da",
                "circle-radius": 8,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>

          {activeEvent && (
            <Popup
              longitude={activeEvent.position[1]}
              latitude={activeEvent.position[0]}
              closeOnClick={false}
              onClose={() => setActiveEvent(null)}
            >
              <div className="popup-inner">
                <h2 className="popup-inner__title">{activeEvent.title}</h2>
                <p className="popup-inner__description">{activeEvent.description}</p>
                <button
                  className="popup-inner__button"
                  onClick={() => handleFavouriteClick(activeEvent.id)}
                >
                  {favourites.includes(activeEvent.id) ? (
                    <span>{fullStar} Unfavourite</span>
                  ) : (
                    <span>{emptyStar} Favourite</span>
                  )}
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      <div className="liked-events">
        <h2 className="liked-events__title">
          <i className="fa-solid fa-star"></i> Favourite Events
        </h2>
        <ul>
          {favourites
            .map((id) => eventsData.find((event) => event.id === id))
            .map((event) => (
              <li
                key={event?.id}
                className="liked-events__event"
                onClick={() => handleListItemClick(event?.id as number)}
              >
                <h3>{event?.title}</h3>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default MapsApp;

import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import AsyncValue from "@/lib/types/AsyncValue";
import { toast } from "burnt";
import { computeDistanceBetween } from "@/lib/utils";

export const useDistance = (initialDistance: number) => {
  const [locationAvailable, setLocationAvailable] = useState<
    AsyncValue<boolean>
  >({
    loaded: false,
  });
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const setPrevLocation = useState<Location.LocationObject | null>(null)[1];
  const [currentDistance, setCurrentDistance] =
    useState<number>(initialDistance);

  useEffect(() => {
    if (!locationAvailable.loaded || !locationAvailable.data) return;

    const beginLocationWatch = async () => {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        result => {
          setPrevLocation(prev => {
            if (prev === null) return result;

            const newDistance = computeDistanceBetween(
              {
                latitude: prev.coords.latitude,
                longitude: prev.coords.longitude,
              },
              {
                latitude: result.coords.latitude,
                longitude: result.coords.longitude,
              }
            );

            setCurrentDistance(currentDistance + newDistance);

            return result;
          });
        }
      );

      setLocationSubscription(subscription);
    };

    if (locationSubscription === null) beginLocationWatch();

    return () => {
      if (locationSubscription !== null) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
    };
  }, [
    currentDistance,
    locationAvailable,
    locationSubscription,
    setPrevLocation,
  ]);

  useEffect(() => {
    setCurrentDistance(initialDistance);
  }, [initialDistance]);

  useEffect(() => {
    async function checkLocation() {
      const permissionStatus =
        await Location.requestForegroundPermissionsAsync();

      if (!permissionStatus.granted) {
        if (!permissionStatus.canAskAgain) {
          toast({
            title: "Greška",
            message: "Odbili ste pristup lokaciji",
          });
          setLocationAvailable({
            loaded: true,
            data: false,
          });
          return;
        }

        const permissionRequest =
          await Location.requestForegroundPermissionsAsync();
        if (!permissionRequest.granted) {
          toast({
            title: "Greška",
            message: "Morate dozvoliti pristup lokaciji",
          });
          setLocationAvailable({
            loaded: true,
            data: false,
          });
          return;
        }
      }

      setLocationAvailable({
        loaded: true,
        data: true,
      });
    }

    checkLocation();
  }, []);

  return useMemo(() => ({ currentDistance }), [currentDistance]);
};

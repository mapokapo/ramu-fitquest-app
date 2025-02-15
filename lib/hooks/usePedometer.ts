import { useEffect, useMemo, useState } from "react";
import { Pedometer } from "expo-sensors";
import AsyncValue from "@/lib/types/AsyncValue";
import { toast } from "burnt";

export const usePedometer = (initialSteps: number) => {
  const [pedometerAvailable, setPedometerAvailable] = useState<
    AsyncValue<boolean>
  >({
    loaded: false,
  });
  const [currentSteps, setCurrentSteps] = useState<number>(initialSteps);

  useEffect(() => {
    if (!pedometerAvailable.loaded) return;
    if (!pedometerAvailable.data) return;

    return Pedometer.watchStepCount(result => {
      if (result.steps <= 1) return;

      setCurrentSteps(result.steps);
    }).remove;
  }, [pedometerAvailable]);

  useEffect(() => {
    setCurrentSteps(initialSteps);
  }, [initialSteps]);

  useEffect(() => {
    async function checkPedometer() {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        toast({
          title: "Greška",
          message: "Praćenje koraka nije dostupno na vašem uređaju",
        });
        setPedometerAvailable({
          loaded: true,
          data: false,
        });
        return;
      }

      const permissionStatus = await Pedometer.getPermissionsAsync();
      if (!permissionStatus.granted) {
        if (!permissionStatus.canAskAgain) {
          toast({
            title: "Greška",
            message: "Odbili ste pristup koracima",
          });
          setPedometerAvailable({
            loaded: true,
            data: false,
          });
          return;
        }

        const permissionRequest = await Pedometer.requestPermissionsAsync();
        if (!permissionRequest.granted) {
          toast({
            title: "Greška",
            message: "Morate dozvoliti pristup koracima",
          });
          setPedometerAvailable({
            loaded: true,
            data: false,
          });
          return;
        }

        setPedometerAvailable({
          loaded: true,
          data: true,
        });
      } else {
        setPedometerAvailable({
          loaded: true,
          data: true,
        });
      }
    }

    checkPedometer();
  }, []);

  return useMemo(() => ({ currentSteps }), [currentSteps]);
};

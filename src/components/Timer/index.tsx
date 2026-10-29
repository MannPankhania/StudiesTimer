
import { useEffect, useRef, useState } from 'react';
import { timeConverter } from '../../common/utils/time';
import { ITarefa } from '../../types/tarefa';
import { Button } from '../Button';
import { Clock } from './Clock';
import S from './style.module.scss';

interface Props {
  selected: ITarefa | undefined;
  endTarefa: () => void;
}

export function Timer({ selected, endTarefa }: Props) {
  const [time, setTime] = useState<number>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function pararCronometro() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    pararCronometro();

    if (selected?.tempo) {
      setTime(timeConverter(selected.tempo));
    } else {
      setTime(undefined);
    }

    return pararCronometro;
  }, [selected]);

  function regressiva() {
    if (time === undefined || time <= 0) return;

    pararCronometro();

    let contador = time;

    intervalRef.current = setInterval(() => {
      contador -= 1;
      setTime(contador);

      if (contador <= 0) {
        pararCronometro();
        endTarefa();
      }
    }, 1000);
  }

  function resetar() {
    pararCronometro();

    if (selected?.tempo) {
      setTime(timeConverter(selected.tempo));
    } else {
      setTime(undefined);
    }
  }

  return (
    <div className={S.timer}>
      <p className={S.title}>Escolha um card e inicie o cronômetro</p>
      <div className={S.clockWrapper}>
        <Clock time={time} />
      </div>
      <Button title="Iniciar" onClick={regressiva} />
      <Button title="Resetar" onClick={resetar} />
    </div>
  );
}

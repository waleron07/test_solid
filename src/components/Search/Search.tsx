import { For, createEffect, createSignal, on } from 'solid-js';
import { BsSortDownAlt } from 'solid-icons/bs';
import { BsSortDown } from 'solid-icons/bs';
import { TItems, TItem } from '../../state/state_types';
import styles from './Search.module.scss';

type ChildProps = {
  items: TItems;
};

export const Search = (props: ChildProps) => {
  const items = () => props.items;
  const [buttonUp, setButtonUp] = createSignal<boolean>(true);
  const [listCity, setListCity] = createSignal<TItems>([]);
  const [searchValue, setSearchValue] = createSignal<string>('');

  const updateListCity = (newItems: TItems, target?: string): TItems => {
    const newTarget =
      target === undefined ? searchValue().toLowerCase() : target;
    const filterListCity =
      newTarget !== ''
        ? newItems.filter((city) => city.toLowerCase().includes(newTarget))
        : [...newItems];
    return sortCallback(buttonUp(), filterListCity);
  };

  const handlerSortListCity = () => {
    setButtonUp(!buttonUp());
    setListCity(sortCallback(buttonUp(), listCity()));
  };

  const handlerUpdateSearchValue = (val: string) => {
    const target = val.toLowerCase();
    const newListCity = updateListCity(items(), target);
    setSearchValue(target);
    setListCity(newListCity);
  };
  createEffect(() => {
    const newListCity = updateListCity(items());
    setListCity(newListCity);
  }, [items()]);

  return (
    <div class={styles.container_search}>
      <div>Search component...</div>
      <div class={styles.container_field}>
        <input
          class={styles.search_input}
          type="text"
          placeholder="... начните вводить текст"
          value={searchValue()}
          onInput={(event) =>
            handlerUpdateSearchValue(event.currentTarget.value)
          }
        />
        <button
          class={styles.search_button}
          type="button"
          onClick={() => handlerSortListCity()}>
          {buttonUp() ? (
            <BsSortDownAlt
              style={{
                'background-color': '#B0C4DE',
                'border-radius': '0.25rem',
              }}
              size={36}
              color="primary"
            />
          ) : (
            <BsSortDown
              style={{
                'background-color': '#B0C4DE',
                'border-radius': '0.25rem',
              }}
              size={36}
              color="primary"
            />
          )}
        </button>
      </div>
      <div class={styles.container_list}>
        <For each={listCity()} fallback={<div>Данных нет...</div>}>
          {(item) => <span class={styles.container_list_element}>{item}</span>}
        </For>
      </div>
    </div>
  );
};

function sortCallback(up: boolean, list: TItems): string[] {
  const sortArr = list.slice().sort((a: TItem, b: TItem) => {
    return up ? a.localeCompare(b) : b.localeCompare(a);
  });
  return sortArr;
}

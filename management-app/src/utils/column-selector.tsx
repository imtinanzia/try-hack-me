import type { RootState } from '../store';

const columnSelector = (state: RootState, name: string): any[] => {
  const data: any = state.kanban;
  const { byId } = data?.[name];
  const names: any[] = [];
  for (const id in byId) {
    if (byId.hasOwnProperty(id) && byId[id].name) {
      const object: any = {
        _id: byId[id]?._id,
        name: byId[id]?.name,
      };

      if (byId[id]?.avatar) {
        object.avatar = byId[id].avatar;
      }
      names.push(object);
    }
  }

  return names;
};

export default columnSelector;

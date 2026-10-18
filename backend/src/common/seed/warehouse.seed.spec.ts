import { WarehouseSeed } from './warehouse.seed';

describe('WarehouseSeed', () => {
  const make = (rawCount: number) => {
    const model = {
      collection: { countDocuments: jest.fn().mockResolvedValue(rawCount) },
      findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      create: jest.fn().mockResolvedValue({}),
    };
    return { seed: new WarehouseSeed(model as never), model };
  };

  it('пустая база — создаёт склады по умолчанию', async () => {
    const { seed, model } = make(0);
    await seed.onApplicationBootstrap();
    expect(model.create).toHaveBeenCalledTimes(2);
  });

  it('склады уже есть (в т.ч. удалённые/переименованные) — ничего не создаёт', async () => {
    const { seed, model } = make(1);
    await seed.onApplicationBootstrap();
    expect(model.create).not.toHaveBeenCalled();
    expect(model.findOne).not.toHaveBeenCalled();
  });
});

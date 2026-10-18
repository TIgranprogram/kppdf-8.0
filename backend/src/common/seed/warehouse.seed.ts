import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Warehouse, WarehouseDocument } from '../../modules/warehouse/warehouse.schema';

interface SeedWarehouse {
  name: string;
  type: 'main' | 'branch' | 'transit' | 'production' | 'other';
  address?: string;
  description?: string;
  zoneNames?: string[];
}

const DEFAULT_WAREHOUSES: readonly SeedWarehouse[] = [
  {
    name: 'Главный склад',
    type: 'main',
    description: 'Основной склад для хранения материалов и готовой продукции',
    zoneNames: ['Зона A', 'Зона B', 'Зона C'],
  },
  {
    name: 'Производственный цех',
    type: 'production',
    description: 'Склад материалов в производственном цехе',
    zoneNames: ['Линия 1', 'Линия 2'],
  },
] as const;

@Injectable()
export class WarehouseSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(WarehouseSeed.name);

  constructor(
    @InjectModel(Warehouse.name) private readonly model: Model<WarehouseDocument>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Склады по умолчанию — только для совсем пустой базы (первый запуск). Раньше сид искал
    // склад по имени и пересоздавал «удалённый» (soft-delete скрывает его от findOne) или
    // переименованный склад при каждом старте. Единая база с data-core: склады ведёт пользователь.
    // Сырой счётчик коллекции — вместе с помеченными удалёнными.
    if ((await this.model.collection.countDocuments({})) > 0) return;
    for (const w of DEFAULT_WAREHOUSES) {
      const existing = await this.model.findOne({ name: w.name }).exec();
      if (existing) continue;

      try {
        await this.model.create({
          name: w.name,
          type: w.type,
          address: w.address,
          description: w.description,
          zoneNames: w.zoneNames ?? [],
          isActive: true,
          roleIds: [],
        });
        this.logger.log(`Warehouse seeded: ${w.name}`);
      } catch (err) {
        this.logger.warn(`Could not seed warehouse ${w.name}: ${(err as Error).message}`);
      }
    }
  }
}

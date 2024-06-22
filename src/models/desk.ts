import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export interface IDeskSkeleton {
  name: string;
  description?: string;
  superDesk?: string;
}

export interface IDesk extends IDeskSkeleton {
  id: string;
  subDesks: string[];
}


class Desk {
  id: string;
  name: string;
  description?: string;
  superDesk?: string;
  subDesks: string[];
  constructor () {
    this.id = uuidv4();
    this.name = '';
    this.description = '';
    this.subDesks = [];
  }

  toObject (): IDesk {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      superDesk: this.superDesk,
      subDesks: this.subDesks
    };
  }

  static async create (newDesk: IDeskSkeleton): Promise<IDesk> {
    const desk = new Desk();
    desk.name = newDesk.name;
    desk.description = newDesk.description;
    desk.superDesk = newDesk.superDesk;

    // Add desk to database
    try {
      await db.desks.add(desk, desk.id);
    } catch (error) {
      console.error("Error adding desk to database", error);
    } finally {
      return desk.toObject();
    }
  }

  static async deleteDesk (id: string): Promise<void> {
    await db.desks.delete(id);
  }
}

export default Desk;
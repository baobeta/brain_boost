import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export interface IDeskSkeleton {
  name: string;
  description?: string;
}

export interface IDesk extends IDeskSkeleton {
  id: string;
  superDesk?: string;
  subDesks: string[];
}

class Desk {
  id: string;
  name: string;
  description?: string;
  superDesk?: string;
  subDesks: string[];
  constructor() {
    this.id = uuidv4();
    this.name = '';
    this.description = '';
    this.subDesks = [];
  }

  toObject(): IDesk {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      superDesk: this.superDesk,
      subDesks: this.subDesks,
    };
  }

  static toModel(desk: IDesk): Desk {
    const newDesk = new Desk();
    newDesk.id = desk.id;
    newDesk.name = desk.name;
    newDesk.description = desk.description;
    newDesk.superDesk = desk.superDesk;
    newDesk.subDesks = desk.subDesks;
    return newDesk;
  }

  static toObject(desk: Desk): IDesk {
    return {
      id: desk.id,
      name: desk.name,
      description: desk.description,
      superDesk: desk.superDesk,
      subDesks: desk.subDesks,
    };
  }

  static async create(newDesk: Desk): Promise<IDesk> {
    try {
      await db.desks.add(newDesk, newDesk.id);
    } catch (error) {
      console.error('Error adding desk to database', error);
    } finally {
      return newDesk;
    }
  }

  static async updateDesk(desk: Desk): Promise<void> {
    try {
      await db.desks.update(desk.id, {
        name: desk.name,
        description: desk.description,
      });
    } catch (error) {
      console.error('Error updating desk in database', error);
    }
  }

  static async deleteDesk(id: string): Promise<void> {
    try {
      await db.desks.delete(id);
    } catch (error) {
      console.error('Error deleting desk in database', error);
    }
  }

  static async getDesk(id: string): Promise<Desk> {
    try {
      const desk = await db.desks.get(id);
      if (!desk) return null;
      return Desk.toModel(desk);
    } catch (error) {
      console.error('Error getting desk from database', error);
      return null;
    }
  }
}

export default Desk;

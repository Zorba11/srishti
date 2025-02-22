import { makeAutoObservable } from 'mobx';
import { MovieStore } from '../MovieStore';
import { IdeaAgentStore } from '../IdeaStore';

export class RootStore {
  movieStore: MovieStore;
  ideaStore: IdeaAgentStore;
  constructor() {
    this.movieStore = new MovieStore();
    this.ideaStore = new IdeaAgentStore();
    makeAutoObservable(this);
  }
}

const rootStore = new RootStore();
export default rootStore;

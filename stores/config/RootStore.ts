import { makeAutoObservable } from 'mobx';
import { MovieStore } from '../MovieStore';
import { IdeaAgentStore } from '../IdeaStore';
import { ScriptAgentStore } from '../ScriptStore';

export class RootStore {
  movieStore: MovieStore;
  ideaStore: IdeaAgentStore;
  scriptStore: ScriptAgentStore;
  constructor() {
    this.movieStore = new MovieStore();
    this.ideaStore = new IdeaAgentStore();
    this.scriptStore = new ScriptAgentStore();
    makeAutoObservable(this);
  }
}

const rootStore = new RootStore();
export default rootStore;

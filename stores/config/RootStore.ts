import { makeAutoObservable } from 'mobx';
import { MovieStore } from '../MovieStore';
import { IdeaAgentStore } from '../IdeaStore';
import { ScriptAgentStore } from '../ScriptStore';
import { ScreenplayAgentStore } from '../ScreenplayStore';

export class RootStore {
  movieStore: MovieStore;
  ideaStore: IdeaAgentStore;
  scriptStore: ScriptAgentStore;
  screenplayStore: ScreenplayAgentStore;
  constructor() {
    this.movieStore = new MovieStore();
    this.ideaStore = new IdeaAgentStore();
    this.scriptStore = new ScriptAgentStore();
    this.screenplayStore = new ScreenplayAgentStore();
    makeAutoObservable(this);
  }
}

const rootStore = new RootStore();
export default rootStore;

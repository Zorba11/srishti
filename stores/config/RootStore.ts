import { makeAutoObservable } from 'mobx';
import { MovieStore } from '../MovieStore';
import { IdeaAgentStore } from '../IdeaStore';
import { ScriptAgentStore } from '../ScriptStore';
import { ScreenplayAgentStore } from '../ScreenplayStore';
import { FrameStore } from '../FrameStore';

export class RootStore {
  movieStore: MovieStore;
  ideaStore: IdeaAgentStore;
  scriptStore: ScriptAgentStore;
  screenplayStore: ScreenplayAgentStore;
  frameStore: FrameStore;
  constructor() {
    this.movieStore = new MovieStore();
    this.ideaStore = new IdeaAgentStore();
    this.scriptStore = new ScriptAgentStore();
    this.screenplayStore = new ScreenplayAgentStore();
    this.frameStore = new FrameStore();
    makeAutoObservable(this);
  }
}

const rootStore = new RootStore();
export default rootStore;

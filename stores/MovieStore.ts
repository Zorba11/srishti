import { makeAutoObservable } from 'mobx';
import { CreateMovieInput, createMovieSchema } from '@/lib/validations/movie';
import { Actor, Movie, MovieStep, Screenplay, Shot } from '@/types/MovieTypes';

export class MovieStore {
  isPowerOn: boolean = false;
  isZeroShotMode: boolean = false;
  currentMovieId: string | null = null;
  currentStep: MovieStep = null;

  private _actors: Actor[] = [];

  // Instead of a public property, we use a private backing field
  private _movies: Movie[] = [];
  private _currentMovie: Movie | null = null;

  isLoading: boolean = false;

  // Add a new observable field to track actor selection
  private _selectedActorId: number | null = null;

  private _selectedIdea: string | null = null;

  private _selectedScript: string | null = null;

  private _selectedScreenplay: Screenplay | null = null;

  constructor() {
    // autoBind ensures actions keep the correct "this" context
    makeAutoObservable(this, {}, { autoBind: true });

    // TODO:these function calling sequence should be optimized later
    this.loadActors();
    this.loadPreviousMovies();
  }

  // Getter for movies – the UI components will use this to get an observable list
  get movies() {
    return this._movies;
  }

  get actors() {
    return this._actors;
  }

  setSelectedScript(script: string) {
    this._selectedScript = script;
  }

  setScreenplay(shots: Shot[]) {
    this._selectedScreenplay = { content: shots };
  }

  get screenplay() {
    return this._selectedScreenplay;
  }

  // Setter for movies – any update to the list goes through here
  setMovies(movies: Movie[]) {
    this._movies = movies;
  }

  setActors(actors: Actor[]) {
    this._actors = actors;
  }

  setCurrentMovieId(id: string) {
    this.currentMovieId = id;
  }

  setPowerOn() {
    this.isPowerOn = !this.isPowerOn;

    // Auto-select the latest movie when turning power on
    if (this.isPowerOn && !this.currentMovieId) {
      const latestMovie = this._movies[0]; // Already sorted by latest in the API
      console.log(`Auto-selecting movie ID: ${latestMovie.id}`);
      this.setActiveMovie(latestMovie.id.toString());
    }
  }

  toggleZeroShotMode() {
    this.isZeroShotMode = !this.isZeroShotMode;
  }

  async createMovie(movieData: Pick<CreateMovieInput, 'moviePrompt'>) {
    try {
      // Validate input data
      const validatedData = createMovieSchema.parse({
        ...movieData,
        promptCharacterCount: movieData.moviePrompt.length,
        promptCharacterCountLimit: 280,
        storyStructureStyle: 'default',
        animationStyle: 'default',
      });

      const response = await fetch('/api/create-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create movie');
      }

      const movie = await response.json();

      this.setCurrentMovieId(movie.id.toString());
      this.setPowerOn();

      return movie;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  }

  async createZeroShotMovie() {
    try {
      // For now, just create a movie with a default prompt
      await this.createMovie({ moviePrompt: 'Create a one-shot movie' });
    } catch (error) {
      console.error('Error creating shot:', error);
      throw error;
    }
  }

  // New methods for each step
  handleIdeaClick() {
    this.currentStep = 'idea';
  }

  handleActorsClick() {
    this.currentStep = 'actors';
    // Implementation coming soon
  }

  handleScriptClick() {
    this.currentStep = 'script';
    // Implementation coming soon
  }

  handleScreenplayClick() {
    if (this.isScriptSelected) {
      this.currentStep = 'screenplay';
    }
  }

  handleShotsClick() {
    this.currentStep = 'shots';
    // Implementation coming soon
  }

  handleFramesClick() {
    this.currentStep = 'frames';
  }

  handleMusicClick() {
    this.currentStep = 'music';
    // Implementation coming soon
  }

  handleDialoguesClick() {
    this.currentStep = 'dialogues';
    // Implementation coming soon
  }

  handleRenderClick() {
    this.currentStep = 'render';
    // Implementation coming soon
  }

  async loadPreviousMovies() {
    this.isLoading = true;
    try {
      const response = await fetch('/api/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const movies = await response.json();
      this.setMovies(movies);
    } catch (error) {
      console.error('Error loading movies:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  setActiveMovie(movieId: string) {
    console.log('[moviestore] setting movie id: ', movieId);
    this.setCurrentMovieId(movieId);
    const movie = this._movies.find((m) => m.id.toString() === movieId) ?? null;
    this._currentMovie = movie;
    this._selectedActorId = movie?.actorId ?? null;

    if (movie?.selectedIdea) {
      this.setIdeaSelected(movie.selectedIdea);
    }
    if (movie?.selectedScript) {
      this.setSelectedScript(movie.selectedScript);
    }

    if (movie?.selectedScreenplay) {
      const screenplay = JSON.parse(movie.selectedScreenplay);
      this.setScreenplay(screenplay);
    }

    this.setPowerOn();
  }

  // Update the currentMovie getter to use the cached value
  get currentMovie(): Movie | null {
    if (!this.currentMovieId) return null;
    return this._currentMovie;
  }

  // Update the isActorSelected getter to use the new field
  get isActorSelected() {
    return Boolean(this._selectedActorId);
  }

  // Add this new getter to easily check if a specific actor is selected
  isActorSelectedById(actorId: number) {
    return this.currentMovie?.actorId === actorId;
  }

  async selectActor(actorId: number): Promise<boolean> {
    if (!this.currentMovieId) return false;

    try {
      const response = await fetch(
        `/api/movies/${this.currentMovieId}/select-actor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ actorId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to select actor');
      }

      // Update the selected actor ID immediately
      this._selectedActorId = actorId;

      // Update the current movie
      if (this._currentMovie) {
        this._currentMovie = {
          ...this._currentMovie,
          actorId,
        };
      }

      // Update the movies array
      const updatedMovies = this._movies.map((movie) =>
        movie.id.toString() === this.currentMovieId
          ? { ...movie, actorId }
          : movie
      );

      this.setMovies(updatedMovies);

      return true;
    } catch (error) {
      console.error('Error selecting actor:', error);
      throw error;
    }
  }

  private async loadActors() {
    try {
      const response = await fetch('/api/actors');
      const data = await response.json();
      this.setActors(data);
    } catch (error) {
      console.error('Error loading actors:', error);
    }
  }

  get isIdeaSelected(): boolean {
    // Check if there's a selected idea using the private field
    return Boolean(this._selectedIdea);
  }

  setIdeaSelected(idea: string) {
    this._selectedIdea = idea;
  }

  async selectIdea(idea: string): Promise<boolean> {
    if (!this.currentMovieId) return false;

    try {
      const response = await fetch(
        `/api/movies/${this.currentMovieId}/select-idea`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idea }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to select idea');
      }

      const updatedMovie = await response.json();

      // Update the current movie
      this._currentMovie = updatedMovie;

      // Update movies array
      const updatedMovies = this._movies.map((movie) =>
        movie.id.toString() === this.currentMovieId ? updatedMovie : movie
      );

      this.setMovies(updatedMovies);

      this.setIdeaSelected(idea);

      // Proceed to next step
      this.handleScriptClick();

      return true;
    } catch (error) {
      console.error('Error selecting idea:', error);
      throw error;
    }
  }

  get isScriptSelected(): boolean {
    return Boolean(this._selectedScript);
  }

  get isScreenplaySelected(): boolean {
    return Boolean(this._selectedScreenplay);
  }

  async generateScript(params: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<boolean> {
    if (!this.currentMovieId) return false;

    try {
      const response = await fetch(
        `/api/movies/${this.currentMovieId}/generate-script`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const updatedMovie = await response.json();

      // Update the current movie
      this._currentMovie = updatedMovie;
      this._selectedScript = updatedMovie.script;

      // Update movies array
      const updatedMovies = this._movies.map((movie) =>
        movie.id.toString() === this.currentMovieId ? updatedMovie : movie
      );

      this.setMovies(updatedMovies);

      return true;
    } catch (error) {
      console.error('Error generating script:', error);
      throw error;
    }
  }

  get numberOfFrames(): number {
    const numberOfFrames = this.screenplay?.content.length ?? 0;
    return numberOfFrames;
  }
}

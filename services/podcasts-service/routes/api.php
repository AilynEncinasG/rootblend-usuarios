<?php

use App\Http\Controllers\PodcastsController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'podcasts-service',
    ]);
});

Route::get('/categorias', [PodcastsController::class, 'categories']);
Route::get('/podcasts', [PodcastsController::class, 'index']);
Route::get('/podcasts/{idPodcast}', [PodcastsController::class, 'show'])->whereNumber('idPodcast');
Route::get('/podcasts/{idPodcast}/episodios', [PodcastsController::class, 'episodes'])->whereNumber('idPodcast');
Route::get('/episodios/{idEpisode}', [PodcastsController::class, 'showEpisode'])->whereNumber('idEpisode');
Route::post('/episodios/{idEpisode}/play', [PodcastsController::class, 'playEpisode'])->whereNumber('idEpisode');

Route::get('/me/dashboard', [PodcastsController::class, 'dashboard']);
Route::get('/me/podcasts', [PodcastsController::class, 'myPodcasts']);
Route::get('/me/episodios', [PodcastsController::class, 'myEpisodes']);
Route::get('/me/historial', [PodcastsController::class, 'myHistory']);
Route::get('/me/stats', [PodcastsController::class, 'myStats']);

Route::post('/podcasts', [PodcastsController::class, 'storePodcast']);
Route::match(['put', 'patch', 'post'], '/podcasts/{idPodcast}', [PodcastsController::class, 'updatePodcast'])->whereNumber('idPodcast');
Route::delete('/podcasts/{idPodcast}', [PodcastsController::class, 'deletePodcast'])->whereNumber('idPodcast');

Route::post('/podcasts/{idPodcast}/episodios', [PodcastsController::class, 'storeEpisode'])->whereNumber('idPodcast');
Route::match(['put', 'patch', 'post'], '/episodios/{idEpisode}', [PodcastsController::class, 'updateEpisode'])->whereNumber('idEpisode');
Route::delete('/episodios/{idEpisode}', [PodcastsController::class, 'deleteEpisode'])->whereNumber('idEpisode');

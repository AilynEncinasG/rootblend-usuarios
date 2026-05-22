<?php

use App\Http\Controllers\InteraccionesController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'interacciones-service',
    ]);
});

Route::get('/me/channel-state', [InteraccionesController::class, 'getChannelState']);
Route::post('/follows', [InteraccionesController::class, 'follow']);
Route::delete('/follows/{idCanal}', [InteraccionesController::class, 'unfollow'])->whereNumber('idCanal');
Route::get('/follows/me', [InteraccionesController::class, 'myFollows']);

Route::post('/subscriptions', [InteraccionesController::class, 'subscribe']);
Route::delete('/subscriptions/{idCanal}', [InteraccionesController::class, 'unsubscribe'])->whereNumber('idCanal');
Route::get('/subscriptions/me', [InteraccionesController::class, 'mySubscriptions']);
Route::get('/channels/{idCanal}/summary', [InteraccionesController::class, 'channelSummary'])->whereNumber('idCanal');
Route::get('/notifications', [InteraccionesController::class, 'notifications']);
Route::patch('/notifications/{idNotificacion}/read', [InteraccionesController::class, 'markNotificationRead'])->whereNumber('idNotificacion');

Route::get('/notifications/config/me', [InteraccionesController::class, 'notificationConfig']);
Route::put('/notifications/config/me', [InteraccionesController::class, 'updateNotificationConfig']);

Route::post('/events/stream-started', [InteraccionesController::class, 'streamStarted']);
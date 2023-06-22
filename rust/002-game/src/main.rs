use bevy::prelude::*;

fn main() {
    App::build()
        .add_plugins(DefaultPlugins)
        .add_startup_system(setup.system())
        .add_system(sprite_movement_system.system())
        .run();
}

fn setup(mut commands: Commands, mut materials: ResMut<Assets<ColorMaterial>>) {
    commands.spawn_bundle(OrthographicCameraBundle::new_2d());

    let sprite_material = materials.add(Color::WHITE.into());
    commands
        .spawn_bundle(SpriteBundle {
            material: sprite_material.clone(),
            sprite: Sprite::new(Vec2::new(64.0, 64.0)),
            transform: Transform::from_translation(Vec3::new(0.0, 0.0, 0.0)),
            ..Default::default()
        })
        .insert(Sprite);
}

fn sprite_movement_system(time: Res<Time>, mut query: Query<&mut Transform, With<Sprite>>) {
    for mut transform in query.iter_mut() {
        transform.translation.x += time.delta_seconds() * 100.0;
    }
}

import { b2Body, b2BodyType, b2ContactListener, b2World } from "box2d.ts";
import { World } from "flat-ecs";
import {
  AssetManager,
  OrthoCamera,
  PolygonBatch,
  Screen,
  ShapeRenderer,
  Vector2,
  Vector3,
  Viewport,
  ViewportInputHandler,
} from "gdxts";
import { Constants } from "../Constant";
import { controlCameraGame, StateGame } from "../dataGame/stateGame";
import { PhysicDebugSystem } from "../RenderSystem/physicDebugSystem";
import { RenderSystem } from "../RenderSystem/RenderSystem";
import { ContactListenerSystem } from "../System/ContactListener";
import { InputHandlerSystem } from "../System/inputHandlerSystem";
import { NextLevelSystem } from "../System/NextLevelSystem";
import { TurnOfTeam } from "../System/TurnOfTeam";
import { createBall, createGround, createPerson } from "../System/utils";
import { CameraGame } from "../System/CameraGame";
const stateGame: StateGame = {
  currentLevel: 2,
  WhoisTurning: 2,
  CooldownTime: 0,
  changeTurn: false,
  conditionWin: false,
  setupTeam1: false,
  setupTeam2: false,
  botDelayTime: 0,
  delayTime: 0,
};

const MAP_HEIGHT = 1000; // map height
export const createGameScreen = async (
  assetManager: AssetManager,
  viewport: Viewport
): Promise<Screen> => {
  if (stateGame.currentLevel > 3) {
    stateGame.currentLevel %= 3;
  }
  const gl = viewport.getContext();
  const camera = viewport.getCamera();

  const viewportInfo = viewport.getViewportInfo();
  const cameraUI = new OrthoCamera(
    Constants.WORLD_WIDTH,
    Constants.WORLD_HEIGHT,
    viewportInfo.worldWidth,
    viewportInfo.worldHeight
  );
  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);

  gl.clearColor(0, 0, 0, 1);
  batch.setYDown(true);

  const world = new World();
  const physicWorld = new b2World({
    x: 0,
    y: -10,
  });

  const mapData = await fetch(`./level${stateGame.currentLevel}.tmj`).then(
    (res) => res.json()
  );
  const groundData = mapData.layers.find(
    (w: any) => w.name === "Ground"
  ).objects;
  // const personTeam1Data = mapData.layers.find(
  //   (p: any) => p.name === "Team1"
  // ).objects;
  // const personTeam2Data = mapData.layers.find(
  //   (p: any) => p.name === "Team2"
  // ).objects;

  // const ball1 = mapData.layex    rs.find((b: any) => b.name === "ball1").objects;

  let grounds: b2Body[] = [];
  let Team1: b2Body[] = [];
  let Team2: b2Body[] = [];
  let ballsTeam1: b2Body[] = [];
  let ballsTeam2: b2Body[] = [];
  stateGame.WhoisTurning = 2;

  for (let ground of groundData) {
    grounds.push(
      createGround(
        physicWorld,
        ground.x / Constants.METER_TO_PHYSIC_WORLD,
        (MAP_HEIGHT - ground.y) / Constants.METER_TO_PHYSIC_WORLD,
        ground.width / Constants.METER_TO_PHYSIC_WORLD,
        ground.height / Constants.METER_TO_PHYSIC_WORLD
      )
    );
  }
  let inputHandle = new ViewportInputHandler(viewport);
  const contactListener = new b2ContactListener();

  let touchTemp = new Vector2(0, 0);
  let originPosition = new Vector2(0, 0);
  let dragPositioning = new Vector2(0, 0);

  const cameraControl: controlCameraGame = {
    introGame: true,
    startCam1: false,
    startCam2: true,
  };

  world.register("gl", gl);
  world.register("viewport", viewport);
  world.register("batch", batch);
  world.register("camera", camera);
  world.register("cameraUI", cameraUI);
  world.register("assetManager", assetManager);
  world.register("physicWorld", physicWorld);
  world.register("inputHandle", inputHandle);
  world.register("groundData", groundData);
  world.register("shapeRenderer", shapeRenderer);
  world.register("mapData", mapData);
  world.register("Team1", Team1);
  world.register("Team2", Team2);
  world.register("ballsTeam1", ballsTeam1);
  world.register("ballsTeam2", ballsTeam2);
  world.register("StateGame", stateGame);
  world.register("contactListener", contactListener);

  let tempX1 = 2;
  let tempY1 = 3.5;
  let tempX2 = 27.25;
  let tempY2 = 10;

  switch (stateGame.currentLevel) {
    case 1:
      for (let i = 0; i < 6; i++) {
        tempX1 += 0.5;
        tempY1 = 3.5;
        for (let j = 0; j < 2; j++) {
          Team1.push(
            createPerson(
              physicWorld,
              tempX1,
              (tempY1 += 0.5),
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
        tempX2 -= 0.5;
        tempY2 = 5;
        for (let j = 0; j < 2; j++) {
          Team2.push(
            createPerson(
              physicWorld,
              tempX2,
              (tempY2 -= 0.5),
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
      }
      break;
    case 2:
      tempX1 = 2.25;
      tempY1 = 3.5;
      tempX2 = 26.5;

      for (let i = 0; i < 6; i++) {
        tempX1 += 0.5;
        tempY1 = 3.5;
        for (let j = 0; j < 2; j++) {
          Team1.push(
            createPerson(
              physicWorld,
              tempX1,
              tempY1++,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
        tempX2 -= 0.5;
        tempY2 = 5;
        for (let j = 0; j < 2; j++) {
          Team2.push(
            createPerson(
              physicWorld,
              tempX2,
              (tempY2 -= 0.5),
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
      }
      break;
    case 3:
      tempX1 = 2.25;
      tempY1 = 3.5;
      tempX2 = 26.5;

      for (let i = 0; i < 6; i++) {
        tempX1 += 0.5;
        tempY1 = 3.5;
        for (let j = 0; j < 2; j++) {
          Team1.push(
            createPerson(
              physicWorld,
              tempX1,
              tempY1++,
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
        tempX2 -= 0.5;
        tempY2 = 5;
        for (let j = 0; j < 3; j++) {
          Team2.push(
            createPerson(
              physicWorld,
              tempX2,
              (tempY2 -= 0.5),
              Constants.PERSON_WIDTH / Constants.METER_TO_PHYSIC_WORLD,
              Constants.PERSON_HEIGHT / Constants.METER_TO_PHYSIC_WORLD,
              { name: "Person" },
              Constants.PERSONTEAM1_CATEGORY_BIT,
              Constants.PERSONTEAM1_MASK_BIT
            )
          );
        }
      }
      break;
    default:
      break;
  }

  const offsetX = 300;
  cameraUI.setPosition(
    Constants.WORLD_WIDTH + Constants.WORLD_WIDTH / 2 + offsetX,
    Constants.WORLD_HEIGHT / 2
  );
  camera.setPosition(Constants.WORLD_WIDTH / 2, Constants.WORLD_HEIGHT / 2);
  const tempVector3 = new Vector3();
  let setCam2Vec = false;

  world.addSystem(new PhysicDebugSystem(), true);
  world.addSystem(new ContactListenerSystem(), true);
  world.addSystem(new RenderSystem(), false);
  // world.addSystem(new CameraGame(), true);

  return {
    update(delta: number) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      batch.setProjection(cameraUI.combined);
      shapeRenderer.setProjection(camera.combined);

      cameraUI.update();

      world.setDelta(delta);
      world.processActiveSystem();
      world.processPassiveSystem();
      physicWorld.Step(delta, 8, 3);
      stateGame.CooldownTime -= delta;
      if (stateGame.WhoisTurning === 2 && cameraControl.startCam1 === false) {
        stateGame.botDelayTime += delta;
        stateGame.delayTime += delta;
      } else {
        stateGame.botDelayTime = 0;
      }

      if (cameraControl.introGame) {
        if (cameraControl.startCam2 === true) {
          if (setCam2Vec === false) {
            setTimeout(() => {
              tempVector3.set(delta * 600, 0, 0);
              setCam2Vec = true;
            }, 1000);
          }
          camera.position.add(tempVector3);

          if (
            camera.position.x >=
            Team2[4].GetPosition().x * Constants.METER_TO_PHYSIC_WORLD
          ) {
            cameraControl.startCam2 = false;
            cameraControl.startCam1 = true;
            tempVector3.set(0, 0, 0);
          }
        }

        if (cameraControl.startCam1) {
          setTimeout(() => {
            tempVector3.set(-delta * 600, 0, 0);
          }, 1000);
          camera.position.add(tempVector3);

          if (
            camera.position.x <=
            Team1[4].GetPosition().x * Constants.METER_TO_PHYSIC_WORLD
          ) {
            cameraControl.startCam1 = false;
            tempVector3.set(0, 0, 0);
            cameraControl.introGame = false;
          }
        }
      }

      if (cameraControl.introGame === false) {
        cameraControl.introGame = true;
        if (Team1.length >= 8 && !stateGame.setupTeam1) {
          stateGame.setupTeam1 = true;
        }
        if (Team2.length >= 8 && !stateGame.setupTeam2) {
          stateGame.setupTeam2 = true;
          for (let i = Team2.length - 1; i >= 0; i--) {
            setTimeout(() => {
              Team2[i].SetActive(false);
            }, 1000);
          }
          setTimeout(() => {
            for (let i = 0; i < Team2.length; i++) {
              ballsTeam2.push(
                createBall(
                  physicWorld,
                  Team2[i].GetPosition().x + 0.2,
                  Team2[i].GetPosition().y + 0.2,
                  0.075,
                  Constants.BALLTEAM2_CATEGORY_BIT,
                  Constants.BALLTEAM2_MASK_BIT
                )
              );
            }
            originPosition = new Vector2(
              ballsTeam2[Math.floor(ballsTeam2.length / 2)].GetPosition().x *
                Constants.METER_TO_PHYSIC_WORLD -
                50,
              ballsTeam2[Math.floor(ballsTeam2.length / 2)].GetPosition().y *
                Constants.METER_TO_PHYSIC_WORLD +
                50
            );

            dragPositioning = new Vector2(
              ballsTeam2[Math.floor(ballsTeam2.length / 2)].GetPosition().x *
                Constants.METER_TO_PHYSIC_WORLD,
              ballsTeam2[Math.floor(ballsTeam2.length / 2)].GetPosition().y *
                Constants.METER_TO_PHYSIC_WORLD
            );
            for (let i = 0; i < Team1.length; i++) {
              Team1[i].SetType(b2BodyType.b2_staticBody);
            }
            for (let i = 0; i < Team2.length; i++) {
              Team2[i].SetType(b2BodyType.b2_staticBody);
            }
            world.register("originPosition", originPosition);
            world.register("dragPositioning", dragPositioning);
            world.addSystem(new InputHandlerSystem(), true);
            world.addSystem(new TurnOfTeam(), true);
            world.addSystem(new NextLevelSystem(), true);
            camera.position.set(
              ballsTeam2[Math.floor(ballsTeam2.length / 2)].GetPosition().x *
                Constants.METER_TO_PHYSIC_WORLD,
              Constants.WORLD_HEIGHT / 2,
              0
            );
            camera.update();
          }, 1500);
        }
      }
    },
    dispose(): void {},
  };
};

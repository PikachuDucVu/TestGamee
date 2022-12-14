import {
  b2Body,
  b2Contact,
  b2ContactListener,
  b2DistanceJointDef,
  b2RevoluteJoint,
  b2RevoluteJointDef,
  b2World,
} from "box2d.ts";
import { System, Inject } from "flat-ecs";
import { StateGame } from "../dataGame/stateGame";
import { physicWorld } from "../GameScreen/GameScreen";
import { HumanPartType, HumanRig } from "./CreateHuman";

export class ContactListenerSystem extends System {
  @Inject("contactListener") contactListener: b2ContactListener;
  @Inject("physicWorld") physicWorld: b2World;
  @Inject("Team1") Team1: HumanRig[];
  @Inject("Team2") Team2: HumanRig[];
  @Inject("ballsTeam1") ballsTeam1: b2Body[];
  @Inject("StateGame") StateGame: StateGame;

  initialized() {
    const jd = new b2RevoluteJointDef();

    this.contactListener.BeginContact = function (contact: b2Contact) {
      const fixtureAbody = contact.GetFixtureA().GetBody();
      const fixtureBbody = contact.GetFixtureB().GetBody();
      if (
        fixtureBbody.GetUserData() === "ball" &&
        fixtureAbody.GetUserData() === "body"
      ) {
        jd.Initialize(
          fixtureAbody,
          fixtureBbody,
          fixtureAbody.GetWorldCenter()
        );
        jd.collideConnected = false;
        jd.lowerAngle = 0;
        jd.upperAngle = 0;
        jd.enableLimit = true;
        physicWorld.m_locked = false;
        physicWorld.CreateJoint(jd);
      }
      if (
        fixtureAbody.GetUserData() !== "body" &&
        fixtureBbody.GetUserData() === "ball"
      ) {
        fixtureBbody.m_activeFlag = false;
      }
    };

    setTimeout(() => {
      this.physicWorld.SetContactListener(this.contactListener);
    }, 500);
  }

  process(): void {
    for (let i = 0; i < this.Team1.length; i++) {
      if (
        Math.abs(
          this.Team1[i].parts[HumanPartType.Torso2].GetPosition().y -
            this.Team1[i].parts[HumanPartType.Head].GetPosition().y
        ) <= 0.3
      ) {
        for (let j = this.Team1[i].parts.length - 1; j >= 0; j--) {
          this.physicWorld.DestroyBody(this.Team1[i].parts[j]);
          this.Team1[i].parts.splice(j, 1);
        }
        this.Team1.splice(i, 1);
      }
    }
    for (let i = 0; i < this.Team2.length; i++) {
      if (
        Math.abs(
          this.Team2[i].parts[HumanPartType.Torso2].GetPosition().y -
            this.Team2[i].parts[HumanPartType.Head].GetPosition().y
        ) <= 0.3
      ) {
        for (let j = this.Team2[i].parts.length - 1; j >= 0; j--) {
          this.physicWorld.DestroyBody(this.Team2[i].parts[j]);
          this.Team2[i].parts.splice(j, 1);
        }
        this.Team2.splice(i, 1);
      }
    }
  }
}

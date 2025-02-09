// Copyright Epic Games, Inc. All Rights Reserved.

#include "MotherAiP.h"
#include "Engine/World.h"
#include "Engine/Engine.h"


#define LOCTEXT_NAMESPACE "FMotherAiPModule"

void FMotherAiPModule::StartupModule()
{
    FWorldDelegates::OnPostLoadMapWithWorld.AddLambda([](UWorld* LoadedWorld)
    {
        if (LoadedWorld && LoadedWorld->IsGameWorld())
        {
            FVector SpawnLocation(0.0f, 0.0f, 0.0f);
            FRotator SpawnRotation = FRotator::ZeroRotator;
            FActorSpawnParameters SpawnParams;

            LoadedWorld->SpawnActor<AMotherAiP>(AMotherAiP::StaticClass(), SpawnLocation, SpawnRotation, SpawnParams);
        }
    });
}


void FMotherAiPModule::ShutdownModule()
{
	// This function may be called during shutdown to clean up your module.  For modules that support dynamic reloading,
	// we call this function before unloading the module.
}

#undef LOCTEXT_NAMESPACE
	
IMPLEMENT_MODULE(FMotherAiPModule, MotherAiP)
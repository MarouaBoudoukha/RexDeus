// Copyright Epic Games, Inc. All Rights Reserved.

#include "MotherAIGameMode.h"
#include "MotherAICharacter.h"
#include "UObject/ConstructorHelpers.h"

AMotherAIGameMode::AMotherAIGameMode()
{
	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/ThirdPerson/Blueprints/BP_ThirdPersonCharacter"));
	if (PlayerPawnBPClass.Class != NULL)
	{
		DefaultPawnClass = PlayerPawnBPClass.Class;
	}
}

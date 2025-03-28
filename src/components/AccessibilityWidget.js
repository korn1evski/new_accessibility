import React, { useState } from "react";
import styled from "styled-components";

const profiles = [
  {
    id: "seizure",
    title: "Seizure Safe Profile",
    description: "Clear flashes & reduces color",
    icon: "⚡",
  },
  {
    id: "vision",
    title: "Vision Impaired Profile",
    description: "Enhances website's visuals",
    icon: "👁",
  },
  {
    id: "adhd",
    title: "ADHD Friendly Profile",
    description: "More focus & fewer distractions",
    icon: "🔲",
  },
  {
    id: "cognitive",
    title: "Cognitive Disability Profile",
    description: "Assists with reading & focusing",
    icon: "🎯",
  },
  {
    id: "keyboard",
    title: "Keyboard Navigation (Motor)",
    description: "Use website with the keyboard",
    icon: "⌨️",
  },
  {
    id: "blind",
    title: "Blind Users (Screen Reader)",
    description: "Optimized for screen readers",
    icon: "🔊",
  },
];

const Widget = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  width: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
`;

const Header = styled.div`
  background: #4169e1;
  color: white;
  padding: 20px;
  border-radius: 10px 10px 0 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: white;
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  color: #4169e1;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const SearchBar = styled.div`
  margin: 15px;
  position: relative;

  input {
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 25px;
    background: #f0f4ff;
    font-size: 16px;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #4169e1;
    }
  }
`;

const ProfileList = styled.div`
  padding: 15px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #f8f9fa;

  &:hover {
    background: #f0f4ff;
  }
`;

const Toggle = styled.div`
  width: 100px;
  height: 36px;
  background: #e9ecef;
  border-radius: 18px;
  position: relative;
  cursor: pointer;
  margin-right: 15px;

  &:before {
    content: "OFF";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #495057;
    font-weight: 600;
    font-size: 12px;
  }

  &:after {
    content: "ON";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #495057;
    font-weight: 600;
    font-size: 12px;
  }
`;

const ToggleButton = styled.div`
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: ${(props) => (props.active ? "68px" : "4px")};
  transition: left 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  p {
    margin: 4px 0 0;
    color: #6c757d;
    font-size: 14px;
  }
`;

const ProfileIcon = styled.div`
  margin-left: 10px;
  font-size: 20px;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #4169e1;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999999;
  transition: transform 0.2s;
  pointer-events: auto;

  &:hover {
    transform: scale(1.1);
    background: #3158d3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.3);
  }
`;

const WidgetContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isVisible ? "0" : "-420px")};
  height: 100vh;
  width: 400px;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 10001;
  overflow-y: auto;
`;

const AccessibilityWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeProfiles, setActiveProfiles] = useState([]);

  const toggleProfile = (profileId) => {
    setActiveProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const resetSettings = () => {
    setActiveProfiles([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Apply accessibility changes when profiles change
  React.useEffect(() => {
    // Example of applying changes to the webpage
    const applyAccessibilityChanges = () => {
      const body = document.body;

      // Reset all changes
      body.style.filter = "";
      body.style.fontSize = "";

      // Apply changes based on active profiles
      if (activeProfiles.includes("seizure")) {
        body.style.filter = "saturate(0.7)";
      }

      if (activeProfiles.includes("vision")) {
        body.style.filter = "contrast(1.2)";
      }

      if (activeProfiles.includes("cognitive")) {
        body.style.fontSize = "110%";
      }
    };

    applyAccessibilityChanges();
  }, [activeProfiles]);

  return (
    <>
      <FloatingButton
        onClick={toggleVisibility}
        aria-label="Toggle Accessibility Menu"
      >
        {isVisible ? "✕" : "♿"}
      </FloatingButton>

      <WidgetContainer isVisible={isVisible}>
        <Header>
          <Title>Accessibility Adjustments 3.0</Title>
          <ButtonGroup>
            <ActionButton onClick={resetSettings}>
              <span>↺</span>
              Reset Settings
            </ActionButton>
            <ActionButton>
              <span>📢</span>
              Statement
            </ActionButton>
            <ActionButton onClick={toggleVisibility}>
              <span>✕</span>
              Close
            </ActionButton>
          </ButtonGroup>
        </Header>

        <SearchBar>
          <input
            type="text"
            placeholder="Unclear content? Search in dictionary..."
          />
        </SearchBar>

        <ProfileList>
          <h3 style={{ margin: "0 15px 15px", fontSize: "18px" }}>
            Choose the right accessibility profile for you
          </h3>

          {profiles.map((profile) => (
            <ProfileItem key={profile.id}>
              <Toggle onClick={() => toggleProfile(profile.id)}>
                <ToggleButton active={activeProfiles.includes(profile.id)} />
              </Toggle>
              <ProfileInfo>
                <h3>{profile.title}</h3>
                <p>{profile.description}</p>
              </ProfileInfo>
              <ProfileIcon>{profile.icon}</ProfileIcon>
            </ProfileItem>
          ))}
        </ProfileList>
      </WidgetContainer>
    </>
  );
};

export default AccessibilityWidget;

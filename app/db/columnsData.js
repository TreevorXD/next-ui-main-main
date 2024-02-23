const columnsData = [
    {
      key: "server_name",
      label: "Name",
    },
    {
      key: "realm_code",
      label: "Realm Code",
      render: (value) => <RealmCodeLink value={value} />,
    },
    {
      key: "discord_server_id",
      label: "Discord Server ID",
    },
    {
      key: "discord_invite",
      label: "Discord Invite",
      render: (value) => <DiscordInviteLink value={value} />,
    },
    {
      key: "xbox_tag",
      label: "Owner's XBL",
    },
    {
      key: "discord_owner_id",
      label: "Owner's Discord ID",
    },
    {
      key: "image_proof",
      label: "Proof",
      render: (value) => <ProofLink value={value} />,
    },
    {
      key: "link",
      label: "Website",
      render: (value) => <SiteLink value={value} />,
    },
    {
      key: "dangerous",
      label: "Suspicious Owner?",
      render: (value) => (value ? "Yes" : "No"),
    },
  ];

  const RealmCodeLink = ({ value }) => (
    <a href={`https://realms.gg/${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
  const DiscordInviteLink = ({ value }) => (
    <a href={`https://discord.gg/${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
  const SiteLink = ({ value }) => (
    <div>
      {Array.isArray(value) ? (
        value.map((image, index) => (
          <div key={index}>
            <a href={image} target="_blank" rel="noopener noreferrer">
              Link {index + 1}
            </a>
          </div>
        ))
      ) : (
        <a href={value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      )}
    </div>
  );
  const ProofLink = ({ value }) => (
    <div>
      {Array.isArray(value) ? (
        value.map((image, index) => (
          <div key={index}>
            <a href={image} target="_blank" rel="noopener noreferrer">
              Link {index + 1}
            </a>
          </div>
        ))
      ) : (
        <a href={value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      )}
    </div>
  );

  
  module.exports = columnsData;
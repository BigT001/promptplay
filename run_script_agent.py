from script_writing_agent import root_agent

if __name__ == "__main__":
    from mcp.server import Server
    server = Server(name="script_writing_agent")
    # Try assigning the agent directly if possible
    try:
        server.agent = root_agent
    except AttributeError:
        pass
    server.run()